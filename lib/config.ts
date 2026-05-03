function numberFromEnv(name: string, fallback: number) {
  const env = typeof process === "undefined" ? undefined : process.env;
  const raw = env?.[name];
  const value = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function stringFromEnv(name: string, fallback: string) {
  const env = typeof process === "undefined" ? undefined : process.env;
  return env?.[name] || fallback;
}

function listFromEnv(name: string, fallback: string[]) {
  return stringFromEnv(name, fallback.join("|"))
    .split("|")
    .map((value) => value.trim())
    .filter(Boolean);
}

export const fareConfig = {
  currency: stringFromEnv("NEXT_PUBLIC_CURRENCY", "AED"),
  baseFare: numberFromEnv("FARE_BASE_AED", 45),
  perKm: numberFromEnv("FARE_PER_KM_AED", 4.5),
  minDistanceKm: numberFromEnv("FARE_MIN_DISTANCE_KM", 5),
  maxDistanceKm: numberFromEnv("FARE_MAX_DISTANCE_KM", 65),
  googleMapsApiKey: stringFromEnv("GOOGLE_MAPS_API_KEY", ""),
  googleMapsRegion: stringFromEnv("GOOGLE_MAPS_REGION", "ae")
};

export const driverConfig = {
  name: stringFromEnv("NEXT_PUBLIC_DRIVER_NAME", "EasyLoad Driver"),
  phone: stringFromEnv("NEXT_PUBLIC_DRIVER_PHONE", "971500000000"),
  location: stringFromEnv("NEXT_PUBLIC_DRIVER_LOCATION", "UAE"),
  vehicle: stringFromEnv("NEXT_PUBLIC_DRIVER_VEHICLE", "Mini truck"),
  hours: stringFromEnv("NEXT_PUBLIC_DRIVER_HOURS", "Available daily"),
  whatsappNote: stringFromEnv(
    "NEXT_PUBLIC_DRIVER_WHATSAPP_NOTE",
    "WhatsApp is preferred for quick booking confirmation."
  )
};

export const locationSuggestions = listFromEnv("NEXT_PUBLIC_LOCATION_SUGGESTIONS", [
  "Dubai Marina",
  "JLT Dubai",
  "Downtown Dubai",
  "Business Bay",
  "Deira Dubai",
  "Bur Dubai",
  "Al Quoz",
  "Jebel Ali",
  "Dubai Silicon Oasis",
  "International City Dubai",
  "Sharjah Industrial Area",
  "Al Nahda Sharjah",
  "Muwaileh Sharjah",
  "Ajman Corniche",
  "Ajman Industrial Area",
  "Abu Dhabi City",
  "Mussafah Abu Dhabi",
  "Al Ain",
  "Ras Al Khaimah",
  "Fujairah"
]);
