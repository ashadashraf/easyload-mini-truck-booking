import { NextRequest, NextResponse } from "next/server";
import { estimateFare, estimateDistanceFromText } from "@/lib/bookings/pricing";
import { fareConfig } from "@/lib/config";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimit(request, {
    keyPrefix: "estimate",
    limit: 60,
    windowMs: 60 * 1000
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const pickupLocation = request.nextUrl.searchParams.get("pickup_location")?.trim();
  const dropLocation = request.nextUrl.searchParams.get("drop_location")?.trim();

  if (!pickupLocation || !dropLocation) {
    return NextResponse.json({ error: "pickup_location and drop_location are required." }, { status: 400 });
  }

  if (pickupLocation.length > 160 || dropLocation.length > 160) {
    return NextResponse.json({ error: "Locations must be 160 characters or fewer." }, { status: 400 });
  }

  return NextResponse.json({
    estimated_price: estimateFare({ pickupLocation, dropLocation }),
    estimated_distance_km: estimateDistanceFromText(pickupLocation, dropLocation),
    estimate_source: "local_preview",
    currency: fareConfig.currency
  });
}
