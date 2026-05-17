import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const requiredKeys = [
  "title",
  "summary",
  "budgetOverview",
  "days",
  "attractions",
  "foodRecommendations",
  "packingTips",
  "weatherAdvice",
  "safetyTips"
];

const extractJson = (value) => {
  try {
    const text = typeof value === "string"
      ? value
      : JSON.stringify(value);

    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);

    const candidate = fenced ? fenced[1] : text;

    const firstBrace = candidate.indexOf("{");
    const lastBrace = candidate.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON object found");
    }

    return JSON.parse(
      candidate.slice(firstBrace, lastBrace + 1)
    );
  } catch (error) {
    throw new Error(`Failed to parse AI JSON: ${error.message}`);
  }
};

const normalizeModelContent = (content) => {
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part?.text) return part.text;
        return "";
      })
      .join("\n");
  }

  return String(content || "");
};

const ensureItineraryShape = (itinerary, request) => {
  const missing = requiredKeys.filter(
    (key) => !(key in itinerary)
  );

  if (missing.length) {
    throw new Error(
      `Missing required keys: ${missing.join(", ")}`
    );
  }

  return {
    title:
      itinerary.title ||
      `${request.duration}-day ${request.destination} itinerary`,

    destination:
      itinerary.destination || request.destination,

    summary: itinerary.summary || "",

    durationDays: Number(
      itinerary.durationDays || request.duration
    ),

    travelers: Number(
      itinerary.travelers || request.people
    ),

    budgetOverview: itinerary.budgetOverview || {},

    days: Array.isArray(itinerary.days)
      ? itinerary.days
      : [],

    attractions: Array.isArray(itinerary.attractions)
      ? itinerary.attractions
      : [],

    foodRecommendations: Array.isArray(
      itinerary.foodRecommendations
    )
      ? itinerary.foodRecommendations
      : [],

    packingTips: Array.isArray(itinerary.packingTips)
      ? itinerary.packingTips
      : [],

    weatherAdvice: Array.isArray(itinerary.weatherAdvice)
      ? itinerary.weatherAdvice
      : [],

    safetyTips: Array.isArray(itinerary.safetyTips)
      ? itinerary.safetyTips
      : [],

    bookingTips: Array.isArray(itinerary.bookingTips)
      ? itinerary.bookingTips
      : [],

    travelNotes: Array.isArray(itinerary.travelNotes)
      ? itinerary.travelNotes
      : [],

    generatedAt: new Date().toISOString()
  };
};

const buildPrompt = (request) => `
Create a detailed, realistic, safe travel itinerary.

Trip Request:
${JSON.stringify(request, null, 2)}

Rules:
- Return ONLY valid JSON
- No markdown
- No explanation text
- Costs must be realistic
- Activities should be practical
- Include local food
- Avoid repeating activities
- Keep the itinerary engaging

Required JSON structure:

{
  "title": "string",
  "destination": "string",
  "summary": "string",
  "durationDays": number,
  "travelers": number,
  "budgetOverview": {
    "currency": "string",
    "totalEstimate": number,
    "perPersonEstimate": number,
    "notes": "string"
  },
  "days": [
    {
      "day": number,
      "title": "string",
      "theme": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "food": "string",
      "costEstimate": number,
      "transportNotes": "string"
    }
  ],
  "attractions": [
    {
      "name": "string",
      "whyVisit": "string",
      "estimatedTime": "string",
      "estimatedCost": number
    }
  ],
  "foodRecommendations": [
    {
      "name": "string",
      "dish": "string",
      "area": "string",
      "budget": "string"
    }
  ],
  "packingTips": ["string"],
  "weatherAdvice": ["string"],
  "safetyTips": ["string"],
  "bookingTips": ["string"],
  "travelNotes": ["string"]
}
`;

const fallbackItinerary = (request) => {
  const dailyCost = 150 * request.people;

  const days = Array.from(
    { length: request.duration },
    (_, index) => ({
      day: index + 1,
      title:
        index === 0
          ? "Arrival and exploration"
          : `Adventure day ${index + 1}`,

      theme:
        request.interests?.[
          index % request.interests.length
        ] || "Travel",

      morning: `Explore a popular area in ${request.destination}.`,

      afternoon: `Visit local attractions and enjoy sightseeing.`,

      evening: `Relax with local food and evening activities.`,

      food: `Try authentic local cuisine in ${request.destination}.`,

      costEstimate: dailyCost,

      transportNotes: `Use ${request.travelMode} for convenient travel.`
    })
  );

  const totalEstimate = days.reduce(
    (sum, day) => sum + day.costEstimate,
    0
  );

  return {
    title: `${request.duration}-day ${request.destination} planner`,
    destination: request.destination,

    summary: `A ${request.duration}-day travel itinerary for ${request.destination}.`,

    durationDays: request.duration,

    travelers: request.people,

    budgetOverview: {
      currency: "USD",
      totalEstimate,
      perPersonEstimate: Math.round(
        totalEstimate / request.people
      ),
      notes:
        "Estimated costs are approximate and may vary by season, availability, and booking choices."
    },

    days,

    attractions: [],

    foodRecommendations: [],

    packingTips: [
      "Carry comfortable shoes",
      "Keep ID documents",
      "Bring weather-appropriate clothes"
    ],

    weatherAdvice: [
      "Check local weather before travel"
    ],

    safetyTips: [
      "Use trusted transportation",
      "Keep valuables secure"
    ],

    bookingTips: [
      "Book hotels early",
      "Reserve attraction tickets in advance"
    ],

    travelNotes: [
      "Confirm opening hours, local conditions, and booking requirements before travel."
    ],

    generatedAt: new Date().toISOString()
  };
};

const createModel = (modelName = env.geminiModel) => {
  return new ChatGoogleGenerativeAI({
    apiKey: env.geminiApiKey,
    model: modelName,
    temperature: 0.7,
    maxRetries: 2
  });
};

const modelCandidates = Array.from(new Set([
  env.geminiModel,
  ...env.geminiFallbackModels
].filter(Boolean)));

const getErrorStatus = (error) =>
  error?.status ||
  error?.statusCode ||
  error?.response?.status ||
  error?.cause?.status;

const getErrorMessage = (error) =>
  [
    error?.message,
    error?.details,
    error?.response?.data?.error?.message,
    error?.cause?.message
  ]
    .filter(Boolean)
    .join(" ");

const isQuotaError = (error) => {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);
  return (
    status === 429 ||
    /quota|rate[- ]limit|resource_exhausted|too many requests/i.test(message)
  );
};

const isInvalidModelError = (error) => {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);
  return (
    status === 404 ||
    /model.*not found|not supported|unsupported|not available/i.test(message)
  );
};

const isAuthError = (error) => {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);
  return (
    status === 401 ||
    status === 403 ||
    /api key|permission denied|unauthorized|forbidden/i.test(message)
  );
};

const shouldTryNextModel = (error) =>
  isQuotaError(error) ||
  isInvalidModelError(error) ||
  /Failed to parse AI JSON|Missing required keys/i.test(getErrorMessage(error));

const tryGenerateWithModel = async (modelName, request) => {
  const model = createModel(modelName);
  const response = await model.invoke([
    new SystemMessage("You are a professional AI travel planner."),
    new HumanMessage(buildPrompt(request))
  ]);

  const content = normalizeModelContent(response.content);
  const parsed = extractJson(content);
  return ensureItineraryShape(parsed, request);
};

export const generateItinerary = async (request) => {
  if (!env.geminiApiKey) {
    if (!env.allowAiFallback) {
      throw new ApiError(503, "Gemini API key not configured");
    }

    return {
      itinerary: fallbackItinerary(request),
      source: "fallback"
    };
  }

  let lastError;

  for (const modelName of modelCandidates) {
    try {
      const itinerary = await tryGenerateWithModel(modelName, request);
      console.log(`Gemini itinerary generated using ${modelName}`);

      return {
        itinerary,
        source: "gemini-langchain"
      };
    } catch (error) {
      lastError = error;

      if (isQuotaError(error)) {
        console.warn(
          `Gemini quota limit reached for ${modelName}. Trying next available model.`
        );
        continue;
      }

      if (isInvalidModelError(error)) {
        console.warn(
          `Gemini model ${modelName} is not available for this API version. Trying next available model.`
        );
        continue;
      }

      if (shouldTryNextModel(error) && !isAuthError(error)) {
        console.warn(
          `Gemini generation failed for ${modelName}. Trying next available model: ${getErrorMessage(error)}`
        );
        continue;
      }

      console.error(`Gemini Error for ${modelName}:`, error);
      break;
    }
  }

  if (!env.allowAiFallback) {
    if (isQuotaError(lastError)) {
      throw new ApiError(
        429,
        "Gemini quota or rate limit reached for all configured models. Wait for quota reset, enable billing, or set GEMINI_MODEL/GEMINI_FALLBACK_MODELS to models with available quota.",
        getErrorMessage(lastError)
      );
    }

    throw new ApiError(
      502,
      "AI itinerary generation failed",
      getErrorMessage(lastError)
    );
  }

  console.warn(
    "All Gemini model attempts failed. Falling back to local itinerary generation."
  );

  return {
    itinerary: fallbackItinerary(request),
    source: "fallback"
  };
};

export const answerTravelQuestion = async ({
  question,
  trip
}) => {
  if (!env.geminiApiKey) {
    return {
      answer:
        "Gemini API key is not configured.",
      source: "fallback"
    };
  }

  try {
    const model = createModel();

    const context = trip
      ? JSON.stringify(
          {
            request: trip.request,
            itinerary: trip.itinerary
          },
          null,
          2
        ).slice(0, 12000)
      : "No itinerary context provided.";

    const response = await model.invoke([
      new SystemMessage(
        "You are an expert AI travel assistant."
      ),

      new HumanMessage(`
Trip Context:
${context}

Question:
${question}
`)
    ]);

    return {
      answer: normalizeModelContent(
        response.content
      ),
      source: "gemini-ai"
    };
  } catch (error) {
    console.error(error);

    throw new ApiError(
      500,
      "Failed to answer travel question",
      error.message
    );
  }
};
