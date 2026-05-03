import { NextRequest, NextResponse } from "next/server";
import { getBookingByAccessToken } from "@/lib/bookings/repository";
import { errorResponse, notFoundResponse } from "@/lib/http";

type Params = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { token } = await params;
    const booking = await getBookingByAccessToken(token);

    if (!booking) {
      return notFoundResponse();
    }

    return NextResponse.json({ booking });
  } catch (error) {
    return errorResponse(error);
  }
}
