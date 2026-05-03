import { NextRequest, NextResponse } from "next/server";
import { getBooking, updateBooking } from "@/lib/bookings/repository";
import { parseUpdateBookingInput } from "@/lib/bookings/validation";
import { requireDriver } from "@/lib/auth/driver";
import { errorResponse, notFoundResponse } from "@/lib/http";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const authError = await requireDriver(_request);

    if (authError) {
      return authError;
    }

    const { id } = await params;
    const booking = await getBooking(id);

    if (!booking) {
      return notFoundResponse();
    }

    return NextResponse.json({ booking });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authError = await requireDriver(request);

    if (authError) {
      return authError;
    }

    const { id } = await params;
    const body = await request.json();
    const input = parseUpdateBookingInput(body);
    const booking = await updateBooking(id, input);

    if (!booking) {
      return notFoundResponse();
    }

    return NextResponse.json({ booking });
  } catch (error) {
    return errorResponse(error);
  }
}
