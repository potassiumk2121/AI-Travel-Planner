import { Trip } from "../models/Trip.js";
import { SavedItinerary } from "../models/SavedItinerary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const [totalTrips, savedCount, favoriteCount, recentTrips, topDestinations] = await Promise.all([
    Trip.countDocuments({ user: req.user._id }),
    SavedItinerary.countDocuments({ user: req.user._id }),
    Trip.countDocuments({ user: req.user._id, isFavorite: true }),
    Trip.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5),
    Trip.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$destinationNormalized", count: { $sum: 1 }, destination: { $first: "$request.destination" } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])
  ]);

  res.json({
    success: true,
    stats: {
      totalTrips,
      savedCount,
      favoriteCount
    },
    profile: req.user.toSafeJSON(),
    recentTrips,
    topDestinations
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, favoriteDestinations, preferences } = req.validated.body;

  if (name) req.user.name = name;
  if (favoriteDestinations) req.user.favoriteDestinations = favoriteDestinations;
  if (preferences) {
    const existingPreferences = req.user.preferences?.toObject ? req.user.preferences.toObject() : req.user.preferences || {};
    req.user.preferences = { ...existingPreferences, ...preferences };
  }

  await req.user.save();

  res.json({
    success: true,
    user: req.user.toSafeJSON()
  });
});
