import { Trip } from "../models/Trip.js";
import { SavedItinerary } from "../models/SavedItinerary.js";
import { generateItinerary } from "../services/aiService.js";
import { recordEvent } from "../services/analyticsService.js";
import { sendItineraryEmail } from "../services/emailService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOwnedTrip = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, user: userId });
  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }
  return trip;
};

const totalCostFromItinerary = (itinerary) => {
  const direct = Number(itinerary?.budgetOverview?.totalEstimate);
  if (Number.isFinite(direct)) return direct;
  return (itinerary?.days || []).reduce((sum, day) => sum + Number(day.costEstimate || 0), 0);
};

export const generateTrip = asyncHandler(async (req, res) => {
  const tripRequest = req.validated.body;
  const { itinerary, source } = await generateItinerary(tripRequest);

  const trip = await Trip.create({
    user: req.user._id,
    request: tripRequest,
    itinerary,
    totalEstimatedCost: totalCostFromItinerary(itinerary),
    source
  });

  await recordEvent({
    eventType: "generate_itinerary",
    user: req.user,
    destination: tripRequest.destination,
    metadata: {
      duration: tripRequest.duration,
      people: tripRequest.people,
      budget: tripRequest.budget,
      source
    },
    req
  });

  res.status(201).json({
    success: true,
    trip
  });
});

export const saveTrip = asyncHandler(async (req, res) => {
  const { tripId, title, notes = "", tags = [] } = req.validated.body;
  const trip = await getOwnedTrip(req.user._id, tripId);

  const saved = await SavedItinerary.findOneAndUpdate(
    { user: req.user._id, trip: trip._id },
    {
      user: req.user._id,
      trip: trip._id,
      title: title || trip.itinerary.title,
      destination: trip.request.destination,
      itinerarySnapshot: trip.itinerary,
      notes,
      tags
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  trip.savedAt = new Date();
  await trip.save();

  await recordEvent({
    eventType: "save_itinerary",
    user: req.user,
    destination: trip.request.destination,
    metadata: { tripId: trip._id.toString() },
    req
  });

  res.status(201).json({
    success: true,
    saved
  });
});

export const getHistory = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, trips });
});

export const getTrip = asyncHandler(async (req, res) => {
  const trip = await getOwnedTrip(req.user._id, req.params.id);
  res.json({ success: true, trip });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await getOwnedTrip(req.user._id, req.params.id);
  await Promise.all([
    SavedItinerary.deleteMany({ user: req.user._id, trip: trip._id }),
    Trip.deleteOne({ _id: trip._id })
  ]);

  res.json({ success: true, message: "Trip deleted" });
});

export const getSavedTrips = asyncHandler(async (req, res) => {
  const saved = await SavedItinerary.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("trip");
  res.json({ success: true, saved });
});

export const favoriteTrip = asyncHandler(async (req, res) => {
  const trip = await getOwnedTrip(req.user._id, req.params.id);
  trip.isFavorite = true;
  await trip.save();

  if (!req.user.favoriteDestinations.includes(trip.request.destination)) {
    req.user.favoriteDestinations.push(trip.request.destination);
    await req.user.save();
  }

  await recordEvent({
    eventType: "favorite_destination",
    user: req.user,
    destination: trip.request.destination,
    metadata: { tripId: trip._id.toString() },
    req
  });

  res.json({ success: true, trip, user: req.user.toSafeJSON() });
});

export const unfavoriteTrip = asyncHandler(async (req, res) => {
  const trip = await getOwnedTrip(req.user._id, req.params.id);
  trip.isFavorite = false;
  await trip.save();

  req.user.favoriteDestinations = req.user.favoriteDestinations.filter(
    (destination) => destination !== trip.request.destination
  );
  await req.user.save();

  res.json({ success: true, trip, user: req.user.toSafeJSON() });
});

export const getFavorites = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user._id, isFavorite: true }).sort({ updatedAt: -1 });
  res.json({ success: true, trips, favoriteDestinations: req.user.favoriteDestinations });
});

export const emailTrip = asyncHandler(async (req, res) => {
  const trip = await getOwnedTrip(req.user._id, req.params.id);
  const to = req.validated.body.email || req.user.email;

  await sendItineraryEmail({ to, user: req.user, trip });
  trip.emailedAt = new Date();
  await trip.save();

  await recordEvent({
    eventType: "email_itinerary",
    user: req.user,
    destination: trip.request.destination,
    metadata: { tripId: trip._id.toString(), to },
    req
  });

  res.json({
    success: true,
    message: `Itinerary emailed to ${to}`
  });
});
