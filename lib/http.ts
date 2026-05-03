import { NextResponse } from "next/server";
import { ValidationError } from "./bookings/validation";

export function errorResponse(error: unknown) {
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof Error && error.message === "final_price is required when status is booked.") {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.error(error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

export function notFoundResponse() {
  return NextResponse.json({ error: "Booking not found." }, { status: 404 });
}
