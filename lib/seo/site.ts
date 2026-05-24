export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://pickupdxb.com").replace(/\/$/, "");

export const SEO_BRAND = {
  name: "PickUp DXB",
  legalName: "PickUp DXB Mini Truck Booking",
  domain: "pickupdxb.com",
  phone: process.env.NEXT_PUBLIC_DRIVER_PHONE || process.env.DRIVER_PHONE || "971500000000",
  logo: `${SITE_URL}/PickUpDxbLogo.png`,
  image: `${SITE_URL}/PickUpDxbBanner.png`,
  sameAs: [] as string[]
};

export const DEFAULT_SEO_DESCRIPTION =
  "Book a 1 ton pickup, mini truck, moving and shifting service across Dubai, Abu Dhabi, Sharjah, Al Quoz, Ajman and the UAE with fast WhatsApp confirmation.";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function canonicalPath(path: string) {
  if (path === "/") {
    return "/";
  }

  return `/${path.split("/").filter(Boolean).join("/")}`;
}
