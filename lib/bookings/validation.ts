import { BOOKING_STATUSES, BookingStatus, CreateBookingInput, UpdateBookingInput } from "./types";
import { getStatusOptions } from "./status-flow";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function parseCreateBookingInput(body: unknown): CreateBookingInput {
  const data = asRecord(body);
  const pickupLocation = requiredString(data.pickup_location, "pickup_location");
  const dropLocation = requiredString(data.drop_location, "drop_location");
  const pickupTime = requiredDateString(data.pickup_time, "pickup_time");
  const dropTime = optionalDateString(data.drop_time, "drop_time");
  const phoneNumber = requiredString(data.phone_number, "phone_number");
  const expectedPrice = optionalMoney(data.expected_price, "expected_price");

  return {
    pickup_location: pickupLocation,
    drop_location: dropLocation,
    pickup_time: pickupTime,
    drop_time: dropTime,
    phone_number: phoneNumber,
    expected_price: expectedPrice
  };
}

export function parseUpdateBookingInput(body: unknown): UpdateBookingInput {
  const data = asRecord(body);
  const status = data.status === undefined ? undefined : parseStatus(data.status);
  const finalPrice = data.final_price === undefined ? undefined : optionalMoney(data.final_price, "final_price");
  const notes = data.notes === undefined ? undefined : optionalString(data.notes, "notes");

  if (status === "booked" && (finalPrice === undefined || finalPrice === null)) {
    throw new ValidationError("final_price is required when status is booked.");
  }

  return { status, final_price: finalPrice, notes };
}

export function validateStatusTransition(currentStatus: BookingStatus, nextStatus: BookingStatus) {
  if (!getStatusOptions(currentStatus).includes(nextStatus)) {
    throw new ValidationError(`Cannot change status from ${currentStatus} to ${nextStatus}.`);
  }
}

function asRecord(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Request body must be an object.");
  }

  return body as Record<string, unknown>;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} is required.`);
  }

  return value.trim();
}

function optionalString(value: unknown, field: string): string | null {
  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be text.`);
  }

  return value.trim() || null;
}

function requiredDateString(value: unknown, field: string): string {
  const text = requiredString(value, field);
  const timestamp = Date.parse(text);

  if (Number.isNaN(timestamp)) {
    throw new ValidationError(`${field} must be a valid date time.`);
  }

  return new Date(timestamp).toISOString();
}

function optionalDateString(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return requiredDateString(value, field);
}

function optionalMoney(value: unknown, field: string): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ValidationError(`${field} must be a positive number.`);
  }

  return Math.round(parsed * 100) / 100;
}

function parseStatus(value: unknown): BookingStatus {
  if (typeof value !== "string" || !BOOKING_STATUSES.includes(value as BookingStatus)) {
    throw new ValidationError("status is invalid.");
  }

  return value as BookingStatus;
}
