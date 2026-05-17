import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatCurrency = (value, currency = "USD") => {
  const number = Number(value || 0);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(number);
  } catch {
    return `${currency} ${number.toLocaleString()}`;
  }
};

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));

export const compactList = (items = []) => items.filter(Boolean).join(", ");
