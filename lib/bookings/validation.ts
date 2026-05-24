import { BOOKING_STATUSES, BookingStatus, CreateBookingInput, UpdateBookingInput } from "./types";
import { getStatusOptions } from "./status-flow";
import { parseUaeDateTime } from "@/lib/format";

const LOCATION_MAX_LENGTH = 160;
const PHONE_MAX_LENGTH = 32;
const NOTES_MAX_LENGTH = 1000;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function parseCreateBookingInput(body: unknown): CreateBookingInput {
  const data = asRecord(body);
  const pickupLocation = requiredString(data.pickup_location, "pickup_location", LOCATION_MAX_LENGTH);
  const dropLocation = requiredString(data.drop_location, "drop_location", LOCATION_MAX_LENGTH);
  const pickupTime = requiredDateString(data.pickup_time, "pickup_time");
  const dropTime = optionalDateString(data.drop_time, "drop_time");
  const phoneNumber = requiredString(data.phone_number, "phone_number", PHONE_MAX_LENGTH);
  const expectedPrice = optionalMoney(data.expected_price, "expected_price");
  const needHelper = optionalBoolean(data.need_helper, "need_helper") ?? false;
  const customerNotes = optionalString(data.customer_notes, "customer_notes", NOTES_MAX_LENGTH);

  return {
    pickup_location: pickupLocation,
    drop_location: dropLocation,
    pickup_time: pickupTime,
    drop_time: dropTime,
    phone_number: phoneNumber,
    expected_price: expectedPrice,
    need_helper: needHelper,
    customer_notes: customerNotes
  };
}

export function parseUpdateBookingInput(body: unknown): UpdateBookingInput {
  const data = asRecord(body);
  const status = data.status === undefined ? undefined : parseStatus(data.status);
  const finalPrice = data.final_price === undefined ? undefined : optionalMoney(data.final_price, "final_price");
  const helperCharge = data.helper_charge === undefined ? undefined : optionalMoney(data.helper_charge, "helper_charge");
  const driverNotes =
    data.driver_notes === undefined
      ? undefined
      : optionalString(data.driver_notes, "driver_notes", NOTES_MAX_LENGTH);

  if (status === "booked" && (finalPrice === undefined || finalPrice === null)) {
    throw new ValidationError("final_price is required when status is booked.");
  }

  return { status, final_price: finalPrice, helper_charge: helperCharge, driver_notes: driverNotes };
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

function requiredString(value: unknown, field: string, maxLength?: number): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} is required.`);
  }

  return validateLength(value.trim(), field, maxLength);
}

function optionalString(value: unknown, field: string, maxLength?: number): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be text.`);
  }

  const trimmed = value.trim();

  return trimmed ? validateLength(trimmed, field, maxLength) : null;
}

function requiredDateString(value: unknown, field: string): string {
  const text = requiredString(value, field);
  const date = parseUaeDateTime(text);

  if (!date) {
    throw new ValidationError(`${field} must be a valid date time.`);
  }

  return date.toISOString();
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

function optionalBoolean(value: unknown, field: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new ValidationError(`${field} must be true or false.`);
  }

  return value;
}

function parseStatus(value: unknown): BookingStatus {
  if (typeof value !== "string" || !BOOKING_STATUSES.includes(value as BookingStatus)) {
    throw new ValidationError("status is invalid.");
  }

  return value as BookingStatus;
}

function validateLength(value: string, field: string, maxLength?: number) {
  if (maxLength && value.length > maxLength) {
    throw new ValidationError(`${field} must be ${maxLength} characters or fewer.`);
  }

  return value;
}
