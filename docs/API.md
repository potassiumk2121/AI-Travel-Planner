# API Documentation

Base URL: `/api`

All protected endpoints require:

```http
Authorization: Bearer <jwt>
```

## Auth

### POST `/auth/signup`

```json
{
  "name": "Sam",
  "email": "sam@example.com",
  "password": "password123"
}
```

Returns a JWT and safe user object.

### POST `/auth/login`

```json
{
  "email": "sam@example.com",
  "password": "password123"
}
```

Returns a JWT and safe user object.

### GET `/auth/me`

Returns the current authenticated user.

## User

### GET `/users/dashboard`

Returns dashboard stats, profile, recent trips, and top destinations.

### PATCH `/users/profile`

```json
{
  "name": "Sam Traveler",
  "favoriteDestinations": ["Tokyo", "Lisbon"],
  "preferences": {
    "defaultBudget": "Moderate",
    "favoriteTravelMode": "Flight",
    "preferredHotelType": "Boutique hotel",
    "interests": ["Food", "History"]
  }
}
```

## Itineraries

### POST `/itineraries/generate`

```json
{
  "currentCity": "New York",
  "destination": "Tokyo",
  "budget": "Moderate",
  "duration": 5,
  "people": 2,
  "travelMode": "Flight",
  "interests": ["Food", "History", "Museums"],
  "hotelPreference": "Boutique hotel"
}
```

Creates a trip and returns the generated itinerary.

### POST `/itineraries/save`

```json
{
  "tripId": "64f000000000000000000000",
  "title": "Tokyo spring plan",
  "notes": "Book TeamLab early",
  "tags": ["spring", "food"]
}
```

Saves an existing generated itinerary.

### GET `/itineraries/history`

Returns generated trip history.

### GET `/itineraries/saved`

Returns saved itinerary snapshots.

### GET `/itineraries/favorites`

Returns favorited trips and destination names.

### GET `/itineraries/:id`

Returns one owned trip.

### DELETE `/itineraries/:id`

Deletes one owned trip and associated saved itinerary records.

### POST `/itineraries/:id/favorite`

Marks a trip as favorite.

### DELETE `/itineraries/:id/favorite`

Removes a trip from favorites.

### POST `/itineraries/:id/email`

```json
{
  "email": "recipient@example.com"
}
```

Sends the itinerary to the supplied email or the user's account email.

## Chat

### POST `/chat`

```json
{
  "question": "What should I pack for Tokyo in March?",
  "tripId": "64f000000000000000000000"
}
```

Returns an AI travel assistant answer. `tripId` is optional.

## Admin

### GET `/admin/stats`

Admin-only. Returns total users, total generated trips, total saved itineraries, most searched destinations, and recent analytics events.
