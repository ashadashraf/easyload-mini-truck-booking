import { fareConfig } from "./config";

export const UAE_TIME_ZONE = "Asia/Dubai";

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
    timeStyle: "short",
    timeZone: UAE_TIME_ZONE
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

export function uaeInputDateTime(value: string | Date | null | undefined) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone: UAE_TIME_ZONE,
    year: "numeric"
  }).formatToParts(date);
  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${valueByType.year}-${valueByType.month}-${valueByType.day}T${valueByType.hour}:${valueByType.minute}`;
}

export function parseUaeDateTime(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const valueWithSeconds = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  const hasTimeZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(valueWithSeconds);
  const date = new Date(hasTimeZone ? valueWithSeconds : `${valueWithSeconds}+04:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function uaeDateTimeToIso(value: string) {
  const date = parseUaeDateTime(value);

  return date ? date.toISOString() : "";
}
