import type { Metadata } from "next";
import Image from "next/image";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { CustomerBookingExperience } from "@/components/CustomerBookingExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { driverConfig, locationSuggestions } from "@/lib/config";
import { featuredSeoLinks, getCity, getService } from "@/lib/seo/content";
import { seoGuides } from "@/lib/seo/guides";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildHomeMetadata("en");

export default function HomePage() {
  return (
    <main className="shell">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={localBusinessSchema()} />
      <div className="container">
        <AppHeader languageHref="/ar" languageLabel="العربية" />
        <section className="landing-hero">
          <div className="hero-copy">
            <span className="eyebrow">Available across UAE</span>
            <h1>Book a Pickup Anywhere in UAE</h1>
            <p>
              Fast, reliable mini truck booking for shifting, delivery, and transport.
              Get an estimate, book quickly, and confirm with the driver on WhatsApp.
            </p>
            <div className="hero-actions" aria-label="Service highlights">
              <span>1 ton pickup</span>
              <span>Instant estimate</span>
              <span>WhatsApp first</span>
            </div>
          </div>
          <div className="hero-card" aria-label="How booking works">
            <div className="hero-card-top">
              <span>Simple flow</span>
              <strong>Location. Details. Confirm.</strong>
            </div>
            <div className="hero-steps">
              <span>Enter pickup and drop-off</span>
              <span>Add timing and items</span>
              <span>Book now, then contact driver</span>
            </div>
          </div>
        </section>
        <section id="booking" aria-label="Book a pickup in UAE">
          <CustomerBookingExperience
            driver={{ name: driverConfig.name, phone: driverConfig.phone }}
            locationSuggestions={locationSuggestions}
          />
        </section>
        <section className="promo-section" aria-labelledby="why-pickupdxb">
          <div className="section-title">
            <span className="eyebrow">Why PickUp DXB?</span>
            <h2 id="why-pickupdxb">Built for quick UAE transport jobs</h2>
            <p className="muted">A simple booking flow for people who want a pickup without complicated apps.</p>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon">01</span>
              <h3>Fast booking</h3>
              <p>Submit route, time, and contact details in one clear card.</p>
            </article>
            <article className="feature-card">
              <span className="feature-icon">02</span>
              <h3>UAE-wide coverage</h3>
              <p>Designed for shifting, delivery, and transport across the UAE.</p>
            </article>
            <article className="feature-card">
              <span className="feature-icon">03</span>
              <h3>Transparent pricing</h3>
              <p>See an estimate first, then agree the final price directly with the driver.</p>
            </article>
            <article className="feature-card">
              <span className="feature-icon">04</span>
              <h3>Helper option</h3>
              <p>Add loading and unloading help when the job needs an extra hand.</p>
            </article>
          </div>
        </section>
        <section className="panel seo-links" aria-labelledby="popular-services-title">
          <div className="section-title">
            <span className="eyebrow">Popular UAE services</span>
            <h2 id="popular-services-title">Pickup, moving and cargo routes people book often</h2>
            <p className="muted">Explore location-specific booking pages for 1 ton pickup and mini truck jobs.</p>
          </div>
          <div className="seo-link-grid">
            {featuredSeoLinks.map(({ citySlug, serviceSlug }) => {
              const city = getCity(citySlug);
              const service = getService(serviceSlug);

              if (!city || !service) {
                return null;
              }

              return (
                <a href={`/${city.slug}/${service.slug}`} key={`${city.slug}-${service.slug}`}>
                  {service.name} in {city.name}
                </a>
              );
            })}
          </div>
        </section>
        <section className="panel seo-links" aria-labelledby="moving-guides-title">
          <div className="section-title">
            <span className="eyebrow">Moving guides</span>
            <h2 id="moving-guides-title">Helpful UAE pickup and shifting guides</h2>
            <p className="muted">Practical advice for booking a mini truck, preparing items and planning a faster move.</p>
          </div>
          <div className="seo-link-grid">
            {seoGuides.map((guide) => (
              <a href={`/guides/${guide.slug}`} key={guide.slug}>
                {guide.title}
              </a>
            ))}
          </div>
        </section>
        <AppFooter />
        <section className="banner-panel" aria-label="PickUp DXB UAE">
          <Image
            src="/PickUpDxbBanner.png"
            alt="PickUp DXB UAE mini truck service"
            width={1536}
            height={472}
            className="banner-image"
          />
        </section>
      </div>
    </main>
  );
}
