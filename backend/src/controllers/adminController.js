import { Analytics } from "../models/Analytics.js";
import { Trip } from "../models/Trip.js";
import { User } from "../models/User.js";
import { SavedItinerary } from "../models/SavedItinerary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalTrips, totalSaved, mostSearchedDestinations, recentEvents] = await Promise.all([
    User.countDocuments(),
    Trip.countDocuments(),
    SavedItinerary.countDocuments(),
    Trip.aggregate([
      { $group: { _id: "$destinationNormalized", count: { $sum: 1 }, destination: { $first: "$request.destination" } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    Analytics.find().sort({ createdAt: -1 }).limit(20).populate("user", "name email")
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalTrips,
      totalSaved
    },
    mostSearchedDestinations,
    recentEvents
  });
});
