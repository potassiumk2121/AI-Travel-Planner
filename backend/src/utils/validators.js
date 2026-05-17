import { z } from "zod";

const trimmedString = (min = 1, max = 200) => z.string().trim().min(min).max(max);

export const signupSchema = z.object({
  body: z.object({
    name: trimmedString(2, 80),
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(128)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(128)
  })
});

export const tripRequestSchema = z.object({
  body: z.object({
    currentCity: trimmedString(2, 120),
    destination: trimmedString(2, 120),
    budget: trimmedString(1, 80),
    duration: z.coerce.number().int().min(1).max(60),
    people: z.coerce.number().int().min(1).max(50),
    travelMode: trimmedString(2, 80),
    interests: z.array(trimmedString(1, 60)).min(1).max(12),
    hotelPreference: trimmedString(2, 100)
  })
});

export const mongoIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id")
  }),
  body: z.object({}).passthrough().optional(),
  query: z.object({}).passthrough().optional()
});

export const saveItinerarySchema = z.object({
  body: z.object({
    tripId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid trip id"),
    title: trimmedString(2, 140).optional(),
    notes: z.string().max(2000).optional(),
    tags: z.array(trimmedString(1, 40)).max(10).optional()
  })
});

export const emailItinerarySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id")
  }),
  body: z.object({
    email: z.string().email().optional()
  })
});

export const chatSchema = z.object({
  body: z.object({
    question: trimmedString(2, 800),
    tripId: z.string().regex(/^[a-f\d]{24}$/i).optional()
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: trimmedString(2, 80).optional(),
    favoriteDestinations: z.array(trimmedString(1, 80)).max(50).optional(),
    preferences: z
      .object({
        defaultBudget: z.string().max(80).optional(),
        favoriteTravelMode: z.string().max(80).optional(),
        preferredHotelType: z.string().max(100).optional(),
        interests: z.array(trimmedString(1, 60)).max(12).optional()
      })
      .optional()
  })
});
