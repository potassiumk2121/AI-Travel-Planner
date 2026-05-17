import { Trip } from "../models/Trip.js";
import { answerTravelQuestion } from "../services/aiService.js";
import { recordEvent } from "../services/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const askTravelAssistant = asyncHandler(async (req, res) => {
  const { question, tripId } = req.validated.body;
  const trip = tripId ? await Trip.findOne({ _id: tripId, user: req.user._id }) : null;
  const result = await answerTravelQuestion({ question, trip });

  await recordEvent({
    eventType: "chat_question",
    user: req.user,
    destination: trip?.request?.destination,
    metadata: { tripId, source: result.source },
    req
  });

  res.json({
    success: true,
    answer: result.answer,
    source: result.source
  });
});
