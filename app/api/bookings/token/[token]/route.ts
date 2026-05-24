import { NextRequest, NextResponse } from "next/server";
import { getBookingByAccessToken } from "@/lib/bookings/repository";
import { toCustomerBooking } from "@/lib/bookings/customer-view";
import { errorResponse, notFoundResponse } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

type Params = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const rateLimitResponse = rateLimit(_request, {
      keyPrefix: "booking-token",
      limit: 120,
      windowMs: 60 * 1000
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { token } = await params;

    if (token.length > 120) {
      return notFoundResponse();
    }

    const booking = await getBookingByAccessToken(token);

    if (!booking) {
      return notFoundResponse();
    }

    return NextResponse.json({ booking: toCustomerBooking(booking) });
  } catch (error) {
    return errorResponse(error);
  }
}
