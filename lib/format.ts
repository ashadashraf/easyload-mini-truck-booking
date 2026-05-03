import { fareConfig } from "./config";

export function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: fareConfig.currency,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatDistance(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Not set";
  }

  return `${value.toLocaleString("en-AE", { maximumFractionDigits: 1 })} km`;
}

export function localInputDateTime(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
