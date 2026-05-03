import { NextRequest, NextResponse } from "next/server";
import { estimateFare, estimateDistanceFromText } from "@/lib/bookings/pricing";
import { fareConfig } from "@/lib/config";

export async function GET(request: NextRequest) {
  const pickupLocation = request.nextUrl.searchParams.get("pickup_location")?.trim();
  const dropLocation = request.nextUrl.searchParams.get("drop_location")?.trim();

  if (!pickupLocation || !dropLocation) {
    return NextResponse.json({ error: "pickup_location and drop_location are required." }, { status: 400 });
  }

  return NextResponse.json({
    estimated_price: estimateFare({ pickupLocation, dropLocation }),
    estimated_distance_km: estimateDistanceFromText(pickupLocation, dropLocation),
    estimate_source: "local_preview",
    currency: fareConfig.currency
  });
}
