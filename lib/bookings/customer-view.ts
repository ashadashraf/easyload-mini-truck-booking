import { Booking, CustomerBooking } from "./types";

export function toCustomerBooking(booking: Booking): CustomerBooking {
  return {
    id: booking.id,
    pickup_location: booking.pickup_location,
    drop_location: booking.drop_location,
    pickup_time: booking.pickup_time,
    drop_time: booking.drop_time,
    estimated_price: booking.estimated_price,
    estimated_distance_km: booking.estimated_distance_km,
    estimated_duration_minutes: booking.estimated_duration_minutes,
    expected_price: booking.expected_price,
    final_price: booking.final_price,
    need_helper: booking.need_helper,
    helper_charge: booking.helper_charge,
    status: booking.status,
    customer_notes: booking.customer_notes,
    driver_notes: booking.driver_notes,
    created_at: booking.created_at,
    updated_at: booking.updated_at
  };
}
