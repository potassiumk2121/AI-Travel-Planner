import axios from "axios";
import { env } from "../config/env.js";

export const sendN8nEvent = async (event) => {
  if (!env.n8nWebhookUrl) {
    return { skipped: true };
  }

  const { data } = await axios.post(env.n8nWebhookUrl, event, {
    timeout: 10000,
    headers: {
      "Content-Type": "application/json"
    }
  });

  return { skipped: false, data };
};
