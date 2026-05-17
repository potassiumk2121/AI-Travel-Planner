import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const isConfigured = () => env.smtp.host && env.smtp.user && env.smtp.pass;

const createTransporter = () =>
  nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });

const listItems = (items = []) => items.map((item) => `<li>${item}</li>`).join("");

const itineraryHtml = ({ user, trip }) => {
  const itinerary = trip.itinerary;
  const days = (itinerary.days || [])
    .map(
      (day) => `
      <h3>Day ${day.day}: ${day.title}</h3>
      <p><strong>Morning:</strong> ${day.morning}</p>
      <p><strong>Afternoon:</strong> ${day.afternoon}</p>
      <p><strong>Evening:</strong> ${day.evening}</p>
      <p><strong>Food:</strong> ${day.food}</p>
    `
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
      <h1>${itinerary.title}</h1>
      <p>Hi ${user.name}, here is your itinerary for ${trip.request.destination}.</p>
      <p>${itinerary.summary}</p>
      ${days}
      <h2>Packing Tips</h2>
      <ul>${listItems(itinerary.packingTips)}</ul>
      <h2>Weather Advice</h2>
      <ul>${listItems(itinerary.weatherAdvice)}</ul>
      <h2>Safety Tips</h2>
      <ul>${listItems(itinerary.safetyTips)}</ul>
    </div>
  `;
};

export const sendItineraryEmail = async ({ to, user, trip }) => {
  if (!isConfigured()) {
    throw new ApiError(503, "Email service is not configured");
  }

  const transporter = createTransporter();

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: `Your ${trip.request.destination} itinerary`,
    html: itineraryHtml({ user, trip })
  });
};
