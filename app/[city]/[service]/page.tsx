import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { getCity, getSeoLandingPages, getService } from "@/lib/seo/content";
import { buildLandingMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

type Props = {
  params: Promise<{
    city: string;
    service: string;
  }>;
};

export function generateStaticParams() {
  return getSeoLandingPages().map(({ city, service }) => ({
    city: city.slug,
    service: service.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getCity(citySlug);
  const service = getService(serviceSlug);

  if (!city || !service) {
    return {};
  }

  return buildLandingMetadata({ city, locale: "en", service });
}

export default async function SeoServicePage({ params }: Props) {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getCity(citySlug);
  const service = getService(serviceSlug);

  if (!city || !service) {
    notFound();
  }

  return <SeoLandingPage city={city} locale="en" service={service} />;
}
