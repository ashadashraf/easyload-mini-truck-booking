import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import type { Locale } from "@/lib/seo/content";
import { getGuidePath, type SeoGuide } from "@/lib/seo/guides";
import { absoluteUrl, SEO_BRAND } from "@/lib/seo/site";
import { breadcrumbSchema, organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { JsonLd } from "./JsonLd";

export function SeoGuidePage({ guide, locale }: { guide: SeoGuide; locale: Locale }) {
  const isArabic = locale === "ar";
  const path = getGuidePath(guide, locale);
  const title = isArabic ? guide.arTitle : guide.title;
  const description = isArabic ? guide.arDescription : guide.description;

  return (
    <main className="shell seo-page" lang={isArabic ? "ar" : "en"} dir={isArabic ? "rtl" : "ltr"}>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: isArabic ? "الرئيسية" : "Home", path: isArabic ? "/ar" : "/" },
          { name: isArabic ? "الأدلة" : "Guides", path },
          { name: title, path }
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: SEO_BRAND.image,
          author: {
            "@id": absoluteUrl("/#organization")
          },
          publisher: {
            "@id": absoluteUrl("/#organization")
          },
          mainEntityOfPage: absoluteUrl(path)
        }}
      />

      <div className="container">
        <AppHeader
          brandHref={isArabic ? "/ar" : "/"}
          bookHref={isArabic ? "/ar#booking" : "/#booking"}
          languageHref={getGuidePath(guide, isArabic ? "en" : "ar")}
          languageLabel={isArabic ? "English" : "العربية"}
          labels={
            isArabic
              ? {
                  book: "احجز",
                  brandTagline: "نخدم جميع الإمارات",
                  mobileTitle: "احجز بيك اب في الإمارات",
                  support: "الدعم"
                }
              : undefined
          }
        />
        <article className="panel seo-guide">
          <nav className="seo-breadcrumb" aria-label={isArabic ? "مسار الصفحة" : "Breadcrumb"}>
            <Link href={isArabic ? "/ar" : "/"}>{isArabic ? "الرئيسية" : "Home"}</Link>
            <span aria-hidden="true">/</span>
            <span>{isArabic ? "دليل" : "Guide"}</span>
          </nav>
          <div className="section-title">
            <span className="eyebrow">{isArabic ? "دليل نقل" : "Moving guide"}</span>
            <h1>{title}</h1>
            <p className="muted">{description}</p>
          </div>
          <div className="seo-guide-sections">
            {guide.sections.map((section) => (
              <section key={section.title}>
                <h2>{isArabic ? section.arTitle : section.title}</h2>
                <p>{isArabic ? section.arText : section.text}</p>
              </section>
            ))}
          </div>
          <div className="seo-cta-row">
            <Link className="button primary" href={isArabic ? "/ar#booking" : "/#booking"}>
              {isArabic ? "احجز بيك اب الآن" : "Book a pickup now"}
            </Link>
            <Link className="button" href={isArabic ? "/ar/dubai/pickup-truck-service" : "/dubai/pickup-truck-service"}>
              {isArabic ? "خدمة بيك اب دبي" : "Pickup service Dubai"}
            </Link>
          </div>
        </article>
        <AppFooter locale={locale} />
      </div>
    </main>
  );
}
