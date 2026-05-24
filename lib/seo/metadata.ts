import type { Metadata } from "next";
import type { Locale, SeoCity, SeoService } from "./content";
import { absoluteUrl, canonicalPath, DEFAULT_SEO_DESCRIPTION, SEO_BRAND, SITE_URL } from "./site";

export function buildBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SEO_BRAND.name,
    title: {
      default: "PickUp DXB | 1 Ton Pickup & Mini Truck Booking UAE",
      template: "%s | PickUp DXB"
    },
    description: DEFAULT_SEO_DESCRIPTION,
    authors: [{ name: SEO_BRAND.name }],
    creator: SEO_BRAND.name,
    publisher: SEO_BRAND.name,
    category: "Logistics",
    alternates: {
      canonical: "/",
      languages: {
        "en-AE": "/",
        "ar-AE": "/ar",
        "x-default": "/"
      }
    },
    openGraph: {
      type: "website",
      siteName: SEO_BRAND.name,
      locale: "en_AE",
      url: absoluteUrl("/"),
      title: "PickUp DXB | 1 Ton Pickup & Mini Truck Booking UAE",
      description: DEFAULT_SEO_DESCRIPTION,
      images: [
        {
          url: SEO_BRAND.image,
          width: 1536,
          height: 472,
          alt: "PickUp DXB UAE mini truck booking"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "PickUp DXB | 1 Ton Pickup & Mini Truck Booking UAE",
      description: DEFAULT_SEO_DESCRIPTION,
      images: [SEO_BRAND.image]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  };
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const isArabic = locale === "ar";
  const title = isArabic
    ? "بيك اب دبي | حجز بيك اب 1 طن وخدمة نقل في الإمارات"
    : "Book a Pickup Anywhere in UAE";
  const description = isArabic
    ? "احجز بيك اب 1 طن وخدمة نقل أثاث وبضائع في دبي وأبوظبي والشارقة وعجمان وجميع أنحاء الإمارات مع تأكيد سريع عبر واتساب."
    : DEFAULT_SEO_DESCRIPTION;
  const path = isArabic ? "/ar" : "/";

  return buildMetadata({
    title,
    description,
    path,
    locale,
    enPath: "/",
    arPath: "/ar"
  });
}

export function buildLandingMetadata({
  city,
  locale,
  service
}: {
  city: SeoCity;
  locale: Locale;
  service: SeoService;
}): Metadata {
  const isArabic = locale === "ar";
  const path = isArabic ? `/ar/${city.slug}/${service.slug}` : `/${city.slug}/${service.slug}`;
  const enPath = `/${city.slug}/${service.slug}`;
  const arPath = `/ar/${city.slug}/${service.slug}`;
  const title = isArabic
    ? `${service.arName} في ${city.arName} | ${SEO_BRAND.name}`
    : `${service.name} in ${city.name} | 1 Ton Pickup UAE`;
  const description = isArabic
    ? `${service.arName} في ${city.arName} من PickUp DXB. احجز ${service.vehicle} لنقل الأثاث والبضائع والصناديق مع تقدير سعر وتواصل واتساب سريع.`
    : `${service.name} in ${city.name} by PickUp DXB. Book a ${service.vehicle} for ${service.intent} with instant estimate, WhatsApp confirmation and UAE-wide transport support.`;

  return buildMetadata({
    title,
    description,
    path,
    locale,
    enPath,
    arPath,
    keywords: isArabic
      ? service.arKeywords.concat([city.arName, "الإمارات", "نقل اثاث الإمارات"])
      : service.keywords.concat([city.name, "UAE", "near me", "truck booking"])
  });
}

function buildMetadata({
  arPath,
  description,
  enPath,
  keywords,
  locale,
  path,
  title
}: {
  arPath: string;
  description: string;
  enPath: string;
  keywords?: string[];
  locale: Locale;
  path: string;
  title: string;
}): Metadata {
  const canonical = canonicalPath(path);
  const url = absoluteUrl(canonical);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        "en-AE": enPath,
        "ar-AE": arPath,
        "x-default": enPath
      }
    },
    openGraph: {
      type: "website",
      siteName: SEO_BRAND.name,
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      alternateLocale: locale === "ar" ? ["en_AE"] : ["ar_AE"],
      url,
      title,
      description,
      images: [
        {
          url: SEO_BRAND.image,
          width: 1536,
          height: 472,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SEO_BRAND.image]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
