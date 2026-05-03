import { NextRequest, NextResponse } from "next/server";
import { createBooking, listBookings } from "@/lib/bookings/repository";
import { parseCreateBookingInput } from "@/lib/bookings/validation";
import { requireDriver } from "@/lib/auth/driver";
import { errorResponse } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireDriver(request);

    if (authError) {
      return authError;
    }

    const bookings = await listBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = parseCreateBookingInput(body);
    const booking = await createBooking(input);
    const accessLink = `${request.nextUrl.origin}/booking/${booking.access_token}`;
    return NextResponse.json({ booking, access_link: accessLink }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
