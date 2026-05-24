import { getSupabaseServerClient } from "@/lib/supabase/server";
import { estimateFareForBooking, fareFromKnownDistance } from "./pricing";
import { Booking, CreateBookingInput, UpdateBookingInput } from "./types";
import { validateStatusTransition } from "./validation";

type BookingRow = Omit<Booking, "estimated_price" | "expected_price" | "final_price" | "helper_charge" | "estimated_distance_km"> & {
  estimated_price: number | string;
  expected_price: number | string | null;
  final_price: number | string | null;
  helper_charge: number | string | null;
  estimated_distance_km: number | string | null;
};

const BOOKING_COLUMNS = `
  id,
  access_token,
  pickup_location,
  drop_location,
  pickup_time,
  drop_time,
  phone_number,
  estimated_price,
  estimated_distance_km,
  estimated_duration_minutes,
  estimate_source,
  expected_price,
  final_price,
  need_helper,
  helper_charge,
  status,
  customer_notes,
  driver_notes,
  created_at,
  updated_at
`;

export async function listBookings(): Promise<Booking[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapBookingRow);
}

export async function getBooking(id: string): Promise<Booking | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapBookingRow(data as BookingRow) : null;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const supabase = getSupabaseServerClient();
  const fareEstimate = await getFareEstimate(input);

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      access_token: generateAccessToken(),
      pickup_location: input.pickup_location,
      drop_location: input.drop_location,
      pickup_time: input.pickup_time,
      drop_time: input.drop_time ?? null,
      phone_number: input.phone_number,
      estimated_price: fareEstimate.estimatedPrice,
      estimated_distance_km: fareEstimate.estimatedDistanceKm,
      estimated_duration_minutes: fareEstimate.estimatedDurationMinutes,
      estimate_source: fareEstimate.estimateSource,
      expected_price: input.expected_price ?? null,
      final_price: null,
      need_helper: input.need_helper ?? false,
      helper_charge: null,
      status: "pending",
      customer_notes: input.customer_notes ?? null,
      driver_notes: null
    })
    .select(BOOKING_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapBookingRow(data as BookingRow);
}

export async function getBookingByAccessToken(accessToken: string): Promise<Booking | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_COLUMNS)
    .eq("access_token", accessToken)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapBookingRow(data as BookingRow) : null;
}

export async function updateBooking(id: string, input: UpdateBookingInput): Promise<Booking | null> {
  const supabase = getSupabaseServerClient();
  const current = await getBooking(id);

  if (!current) {
    return null;
  }

  if (input.status && input.status !== current.status) {
    validateStatusTransition(current.status, input.status);
  }

  const finalPrice = input.final_price !== undefined ? input.final_price : current.final_price;
  const nextStatus = input.status ?? current.status;

  if (nextStatus === "booked" && finalPrice === null) {
    throw new Error("final_price is required when status is booked.");
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };

  if (input.status !== undefined) {
    patch.status = input.status;
  }

  if (input.final_price !== undefined) {
    patch.final_price = input.final_price;
  }

  if (input.helper_charge !== undefined) {
    patch.helper_charge = input.helper_charge;
  }

  if (input.driver_notes !== undefined) {
    patch.driver_notes = input.driver_notes;
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", id)
    .select(BOOKING_COLUMNS)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapBookingRow(data as BookingRow) : null;
}

async function getFareEstimate(input: CreateBookingInput) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("estimated_distance_km, estimated_duration_minutes")
    .ilike("pickup_location", input.pickup_location)
    .ilike("drop_location", input.drop_location)
    .not("estimated_distance_km", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data && typeof data.estimated_distance_km !== "undefined" && data.estimated_distance_km !== null) {
    return fareFromKnownDistance(
      toNullableNumber(data.estimated_distance_km) ?? 0,
      toNullableNumber(data.estimated_duration_minutes),
      "reused"
    );
  }

  return estimateFareForBooking({
    pickupLocation: input.pickup_location,
    dropLocation: input.drop_location
  });
}

function mapBookingRow(row: BookingRow): Booking {
  return {
    ...row,
    customer_notes: row.customer_notes ?? null,
    driver_notes: row.driver_notes ?? null,
    estimated_price: toNumber(row.estimated_price),
    estimated_distance_km: toNullableNumber(row.estimated_distance_km),
    expected_price: toNullableNumber(row.expected_price),
    final_price: toNullableNumber(row.final_price),
    helper_charge: toNullableNumber(row.helper_charge)
  };
}

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function toNullableNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "number" ? value : Number(value);
}

function generateAccessToken() {
  return crypto.randomUUID() + "-" + crypto.randomUUID();
}
