import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoGuidePage } from "@/components/seo/SeoGuidePage";
import { getGuide, getGuidePath, seoGuides } from "@/lib/seo/guides";
import { absoluteUrl, SEO_BRAND } from "@/lib/seo/site";

export const dynamicParams = false;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return seoGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: getGuidePath(guide, "en"),
      languages: {
        "en-AE": getGuidePath(guide, "en"),
        "ar-AE": getGuidePath(guide, "ar"),
        "x-default": getGuidePath(guide, "en")
      }
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(getGuidePath(guide, "en")),
      title: guide.title,
      description: guide.description,
      images: [SEO_BRAND.image]
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [SEO_BRAND.image]
    }
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  return <SeoGuidePage guide={guide} locale="en" />;
}
