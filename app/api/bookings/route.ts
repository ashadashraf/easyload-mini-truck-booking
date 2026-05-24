import { NextRequest, NextResponse } from "next/server";
import { createBooking, listBookings } from "@/lib/bookings/repository";
import { toCustomerBooking } from "@/lib/bookings/customer-view";
import { parseCreateBookingInput } from "@/lib/bookings/validation";
import { requireDriver } from "@/lib/auth/driver";
import { errorResponse } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

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
    const rateLimitResponse = rateLimit(request, {
      keyPrefix: "create-booking",
      limit: 12,
      windowMs: 60 * 60 * 1000
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const contentLength = Number(request.headers.get("content-length") || 0);

    if (contentLength > 10_000) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }

    const body = await request.json();
    const input = parseCreateBookingInput(body);
    const booking = await createBooking(input);
    const accessLink = `${request.nextUrl.origin}/booking/${booking.access_token}`;
    return NextResponse.json({ booking: toCustomerBooking(booking), access_link: accessLink }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
