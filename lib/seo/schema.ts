import { driverConfig } from "@/lib/config";
import type { Locale, SeoCity, SeoService } from "./content";
import { absoluteUrl, SEO_BRAND } from "./site";

export type QuestionAnswer = {
  answer: string;
  question: string;
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SEO_BRAND.name,
    legalName: SEO_BRAND.legalName,
    url: absoluteUrl("/"),
    logo: SEO_BRAND.logo,
    image: SEO_BRAND.image,
    telephone: `+${SEO_BRAND.phone.replace(/\D/g, "")}`,
    areaServed: "United Arab Emirates",
    sameAs: SEO_BRAND.sameAs
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SEO_BRAND.name,
    url: absoluteUrl("/"),
    inLanguage: ["en-AE", "ar-AE"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#localbusiness"),
    name: SEO_BRAND.name,
    url: absoluteUrl("/"),
    image: SEO_BRAND.image,
    logo: SEO_BRAND.logo,
    telephone: `+${SEO_BRAND.phone.replace(/\D/g, "")}`,
    priceRange: "AED",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AE",
      addressLocality: driverConfig.location
    },
    areaServed: [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Al Ain",
      "Fujairah",
      "Ras Al Khaimah",
      "Umm Al Quwain"
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59"
    }
  };
}

export function serviceSchema({
  city,
  locale,
  path,
  service
}: {
  city: SeoCity;
  locale: Locale;
  path: string;
  service: SeoService;
}) {
  const isArabic = locale === "ar";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name: isArabic ? `${service.arName} في ${city.arName}` : `${service.name} in ${city.name}`,
    serviceType: isArabic ? service.arName : service.name,
    provider: {
      "@id": absoluteUrl("/#localbusiness")
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: isArabic ? city.arName : city.name,
      addressCountry: "AE"
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/"),
      servicePhone: `+${SEO_BRAND.phone.replace(/\D/g, "")}`
    },
    description: isArabic
      ? `${service.arName} في ${city.arName} لحجز ${service.vehicle} ونقل الأثاث والبضائع داخل الإمارات.`
      : `${service.name} in ${city.name} for ${service.intent} across the UAE.`
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function faqSchema(items: QuestionAnswer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
