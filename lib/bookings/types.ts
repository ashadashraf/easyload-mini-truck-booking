export const BOOKING_STATUSES = ["pending", "contacted", "booked", "completed", "rejected"] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type Booking = {
  id: number;
  access_token: string;
  pickup_location: string;
  drop_location: string;
  pickup_time: string;
  drop_time: string | null;
  phone_number: string;
  estimated_price: number;
  estimated_distance_km: number | null;
  estimated_duration_minutes: number | null;
  estimate_source: "google_maps" | "local_fallback" | "reused";
  expected_price: number | null;
  final_price: number | null;
  need_helper: boolean;
  helper_charge: number | null;
  status: BookingStatus;
  customer_notes: string | null;
  driver_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerBooking = Omit<Booking, "access_token" | "phone_number" | "estimate_source">;

export type CreateBookingInput = {
  pickup_location: string;
  drop_location: string;
  pickup_time: string;
  drop_time?: string | null;
  phone_number: string;
  expected_price?: number | null;
  need_helper?: boolean;
  customer_notes?: string | null;
};

export type UpdateBookingInput = {
  status?: BookingStatus;
  final_price?: number | null;
  helper_charge?: number | null;
  driver_notes?: string | null;
};
