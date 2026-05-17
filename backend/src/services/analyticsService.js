import { Analytics } from "../models/Analytics.js";
import { appendAnalyticsRow } from "./sheetsService.js";
import { sendN8nEvent } from "./n8nService.js";

export const recordEvent = async ({ eventType, user, destination, metadata = {}, req }) => {
  const payload = {
    eventType,
    user: user?._id,
    userId: user?._id?.toString(),
    userEmail: user?.email,
    destination,
    metadata,
    ip: req?.ip,
    userAgent: req?.headers?.["user-agent"],
    createdAt: new Date().toISOString()
  };

  const saved = await Analytics.create({
    eventType,
    user: user?._id,
    destination,
    metadata,
    ip: req?.ip,
    userAgent: req?.headers?.["user-agent"]
  });

  Promise.allSettled([appendAnalyticsRow(payload), sendN8nEvent(payload)]).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.warn(`Automation log failed: ${result.reason?.message || result.reason}`);
      }
    });
  });

  return saved;
};
