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

function publicOrServerStringFromEnv(serverName: string, publicName: string, fallback: string) {
  const env = typeof process === "undefined" ? undefined : process.env;
  return env?.[serverName] || env?.[publicName] || fallback;
}

function listFromEnv(name: string, fallback: string[]) {
  return stringFromEnv(name, fallback.join("|"))
    .split("|")
    .map((value) => value.trim())
    .filter(Boolean);
}

export const fareConfig = {
  currency: stringFromEnv("NEXT_PUBLIC_CURRENCY", "AED"),
  baseFare: numberFromEnv("FARE_BASE_AED", 60),
  perKm: numberFromEnv("FARE_PER_KM_AED", 4),
  includedKm: numberFromEnv("FARE_INCLUDED_KM", 5),
  fallbackMinDistanceKm: numberFromEnv("FARE_FALLBACK_MIN_DISTANCE_KM", 1),
  fallbackMaxDistanceKm: numberFromEnv("FARE_FALLBACK_MAX_DISTANCE_KM", 250),
  googleMapsApiKey: stringFromEnv("GOOGLE_MAPS_API_KEY", ""),
  googleMapsRegion: stringFromEnv("GOOGLE_MAPS_REGION", "ae")
};

export const driverConfig = {
  name: publicOrServerStringFromEnv("DRIVER_NAME", "NEXT_PUBLIC_DRIVER_NAME", "EasyLoad Driver"),
  phone: publicOrServerStringFromEnv("DRIVER_PHONE", "NEXT_PUBLIC_DRIVER_PHONE", "971500000000"),
  location: publicOrServerStringFromEnv("DRIVER_LOCATION", "NEXT_PUBLIC_DRIVER_LOCATION", "UAE"),
  vehicle: publicOrServerStringFromEnv("DRIVER_VEHICLE", "NEXT_PUBLIC_DRIVER_VEHICLE", "Mini truck"),
  hours: publicOrServerStringFromEnv("DRIVER_HOURS", "NEXT_PUBLIC_DRIVER_HOURS", "Available daily"),
  whatsappNote: publicOrServerStringFromEnv(
    "DRIVER_WHATSAPP_NOTE",
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
