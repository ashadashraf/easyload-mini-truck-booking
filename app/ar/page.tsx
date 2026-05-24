import type { Metadata } from "next";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { CustomerBookingExperience } from "@/components/CustomerBookingExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { driverConfig, locationSuggestions } from "@/lib/config";
import { phoneHref, whatsappHref } from "@/lib/driver";
import { featuredSeoLinks, getCity, getService, seoCities } from "@/lib/seo/content";
import { seoGuides } from "@/lib/seo/guides";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildHomeMetadata("ar");

export default function ArabicHomePage() {
  const message = `مرحبا ${driverConfig.name}، أريد حجز بيك اب 1 طن في الإمارات.`;

  return (
    <main className="shell seo-page" lang="ar" dir="rtl">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={localBusinessSchema()} />

      <div className="container">
        <AppHeader
          brandHref="/ar"
          bookHref="/ar#booking"
          languageHref="/"
          languageLabel="English"
          labels={{
            book: "احجز",
            brandTagline: "نخدم جميع الإمارات",
            mobileTitle: "احجز بيك اب في الإمارات",
            support: "الدعم"
          }}
        />

        <section className="seo-hero">
          <div className="seo-hero-copy">
            <span className="eyebrow">خدمة نقل في الإمارات</span>
            <h1>بيك اب دبي وحجز شاحنة صغيرة في الإمارات</h1>
            <p>
              احجز بيك اب 1 طن لنقل الأثاث والصناديق والبضائع داخل دبي وأبوظبي والشارقة وعجمان وباقي الإمارات.
              احصل على تقدير سعر سريع وتواصل مباشر عبر واتساب.
            </p>
            <div className="seo-cta-row">
              <Link className="button primary" href="/ar#booking">
                احجز الآن
              </Link>
              <a className="button" href={whatsappHref(driverConfig.phone, message)} rel="noreferrer" target="_blank">
                واتساب
              </a>
              <a className="button" href={phoneHref(driverConfig.phone)}>
                اتصال
              </a>
            </div>
          </div>
          <aside className="seo-trust-panel" aria-label="مميزات الخدمة">
            <strong>بيك اب 1 طن</strong>
            <ul>
              <li>نقل أثاث وشقق وغرف</li>
              <li>توصيل بضائع ومستلزمات متاجر</li>
              <li>خيار مساعد للتحميل والتنزيل</li>
              <li>تغطية داخل الإمارات</li>
            </ul>
          </aside>
        </section>

        <section id="booking" aria-label="احجز بيك اب في الإمارات">
          <CustomerBookingExperience
            driver={{ name: driverConfig.name, phone: driverConfig.phone }}
            locale="ar"
            locationSuggestions={locationSuggestions}
          />
        </section>

        <section className="panel seo-links" aria-labelledby="arabic-areas-title">
          <div className="section-title">
            <span className="eyebrow">المدن والمناطق</span>
            <h2 id="arabic-areas-title">خدمات بيك اب ونقل في الإمارات</h2>
            <p className="muted">صفحات عربية قابلة للفهرسة لخدمات النقل والحجز في المدن الرئيسية.</p>
          </div>
          <div className="seo-link-grid">
            {seoCities.map((city) => (
              <Link href={`/ar/${city.slug}/pickup-truck-service`} key={city.slug}>
                خدمة بيك اب في {city.arName}
              </Link>
            ))}
          </div>
        </section>

        <section className="promo-section" aria-labelledby="arabic-featured-title">
          <div className="section-title">
            <span className="eyebrow">روابط شائعة</span>
            <h2 id="arabic-featured-title">حجوزات مطلوبة بكثرة</h2>
          </div>
          <div className="feature-grid">
            {featuredSeoLinks.map(({ citySlug, serviceSlug }, index) => {
              const city = getCity(citySlug);
              const service = getService(serviceSlug);

              if (!city || !service) {
                return null;
              }

              return (
                <article className="feature-card" key={`${city.slug}-${service.slug}`}>
                  <span className="feature-icon">{String(index + 1).padStart(2, "0")}</span>
                  <h3>
                    <Link href={`/ar/${city.slug}/${service.slug}`}>
                      {service.arName} في {city.arName}
                    </Link>
                  </h3>
                  <p>صفحة خدمة مخصصة للحجز السريع ومعرفة التفاصيل قبل التواصل مع السائق.</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel seo-links" aria-labelledby="arabic-guides-title">
          <div className="section-title">
            <span className="eyebrow">أدلة النقل</span>
            <h2 id="arabic-guides-title">نصائح للحجز والنقل في الإمارات</h2>
          </div>
          <div className="seo-link-grid">
            {seoGuides.map((guide) => (
              <Link href={`/ar/guides/${guide.slug}`} key={guide.slug}>
                {guide.arTitle}
              </Link>
            ))}
          </div>
        </section>

        <AppFooter locale="ar" />
      </div>
    </main>
  );
}
