import type { Metadata } from "next";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoGuides } from "@/lib/seo/guides";
import { absoluteUrl, SEO_BRAND } from "@/lib/seo/site";
import { breadcrumbSchema, organizationSchema, websiteSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "UAE Moving & Pickup Truck Blog",
  description:
    "Helpful Dubai and UAE guides for pickup truck booking, furniture moving, apartment shifting, appliance transport and mini truck pricing.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    title: "UAE Moving & Pickup Truck Blog",
    description:
      "Helpful Dubai and UAE guides for pickup truck booking, furniture moving, apartment shifting, appliance transport and mini truck pricing.",
    images: [SEO_BRAND.image]
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE Moving & Pickup Truck Blog",
    description:
      "Helpful Dubai and UAE guides for pickup truck booking, furniture moving, apartment shifting, appliance transport and mini truck pricing.",
    images: [SEO_BRAND.image]
  }
};

export default function BlogPage() {
  return (
    <main className="shell seo-page">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" }
        ])}
      />

      <div className="container">
        <AppHeader />
        <section className="panel seo-guide">
          <nav className="seo-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Blog</span>
          </nav>
          <div className="section-title">
            <span className="eyebrow">Moving guides</span>
            <h1>UAE moving and pickup truck blog</h1>
            <p className="muted">
              Practical guides for customers planning furniture moving, apartment shifting, cargo delivery and 1 ton pickup bookings in Dubai and the UAE.
            </p>
          </div>
          <div className="seo-link-grid">
            {seoGuides.map((guide) => (
              <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                {guide.title}
              </Link>
            ))}
          </div>
        </section>
        <AppFooter />
      </div>
    </main>
  );
}
