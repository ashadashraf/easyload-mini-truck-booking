import { fareConfig } from "@/lib/config";

type EstimateInput = {
  pickupLocation: string;
  dropLocation: string;
};

type FareEstimate = {
  estimatedPrice: number;
  estimatedDistanceKm: number;
  estimatedDurationMinutes: number | null;
  estimateSource: "google_maps" | "local_fallback" | "reused";
};

type GoogleDistanceMatrixResponse = {
  status: string;
  error_message?: string;
  rows?: Array<{
    elements?: Array<{
      status: string;
      distance?: {
        value: number;
      };
      duration?: {
        value: number;
      };
    }>;
  }>;
};

export function estimateFare({ pickupLocation, dropLocation }: EstimateInput): number {
  const distanceKm = estimateDistanceFromText(pickupLocation, dropLocation);
  return priceFromDistance(distanceKm);
}

export async function estimateFareForBooking(input: EstimateInput): Promise<FareEstimate> {
  if (!fareConfig.googleMapsApiKey) {
    return localFareEstimate(input);
  }

  try {
    const googleEstimate = await estimateWithGoogleDistanceMatrix(input);
    return googleEstimate ?? localFareEstimate(input);
  } catch (error) {
    console.error("Google distance estimate failed. Falling back to local estimate.", error);
    return localFareEstimate(input);
  }
}

export function fareFromKnownDistance(
  distanceKm: number,
  durationMinutes: number | null,
  source: FareEstimate["estimateSource"] = "reused"
): FareEstimate {
  return {
    estimatedPrice: priceFromDistance(distanceKm),
    estimatedDistanceKm: roundDistance(distanceKm),
    estimatedDurationMinutes: durationMinutes,
    estimateSource: source
  };
}

export function estimateDistanceFromText(pickupLocation: string, dropLocation: string): number {
  const normalized = `${pickupLocation}|${dropLocation}`.toLowerCase().trim();
  const minDistance = Math.max(1, Math.floor(fareConfig.fallbackMinDistanceKm));
  const maxDistance = Math.max(minDistance, Math.floor(fareConfig.fallbackMaxDistanceKm));
  let hash = 0;

  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
  }

  return minDistance + (hash % (maxDistance - minDistance + 1));
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function localFareEstimate(input: EstimateInput): FareEstimate {
  const distanceKm = estimateDistanceFromText(input.pickupLocation, input.dropLocation);

  return {
    estimatedPrice: priceFromDistance(distanceKm),
    estimatedDistanceKm: distanceKm,
    estimatedDurationMinutes: null,
    estimateSource: "local_fallback"
  };
}

async function estimateWithGoogleDistanceMatrix(input: EstimateInput): Promise<FareEstimate | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.set("origins", input.pickupLocation);
  url.searchParams.set("destinations", input.dropLocation);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("units", "metric");
  url.searchParams.set("region", fareConfig.googleMapsRegion);
  url.searchParams.set("key", fareConfig.googleMapsApiKey);

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Google Maps request failed with ${response.status}.`);
  }

  const data = (await response.json()) as GoogleDistanceMatrixResponse;
  const element = data.rows?.[0]?.elements?.[0];

  if (data.status !== "OK" || element?.status !== "OK" || !element.distance) {
    throw new Error(data.error_message || `Google Maps returned ${data.status}/${element?.status || "NO_RESULT"}.`);
  }

  const distanceKm = roundDistance(element.distance.value / 1000);
  const durationMinutes = element.duration ? Math.max(1, Math.round(element.duration.value / 60)) : null;

  return {
    estimatedPrice: priceFromDistance(distanceKm),
    estimatedDistanceKm: distanceKm,
    estimatedDurationMinutes: durationMinutes,
    estimateSource: "google_maps"
  };
}

function priceFromDistance(distanceKm: number) {
  const includedKm = Math.max(0, fareConfig.includedKm);
  const billableExtraKm = Math.max(0, distanceKm - includedKm);
  return roundMoney(fareConfig.baseFare + billableExtraKm * fareConfig.perKm);
}

function roundDistance(value: number) {
  return Math.round(value * 10) / 10;
}
