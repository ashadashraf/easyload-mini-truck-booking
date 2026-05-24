import Link from "next/link";
import { driverConfig } from "@/lib/config";
import { phoneHref, whatsappHref } from "@/lib/driver";
import { featuredSeoLinks, getCity, getService } from "@/lib/seo/content";

type AppFooterProps = {
  locale?: "ar" | "en";
};

export function AppFooter({ locale = "en" }: AppFooterProps) {
  const isArabic = locale === "ar";
  const message = isArabic
    ? `مرحبا ${driverConfig.name}، أريد الاستفسار عن توفر بيك اب.`
    : `Hello ${driverConfig.name}, I want to ask about mini truck availability.`;

  return (
    <footer className="footer" id="support">
      <div>
        <strong>{driverConfig.name}</strong>
        <p>
          {isArabic ? "بيك اب 1 طن" : driverConfig.vehicle} -{" "}
          {isArabic ? "القوز، دبي، الإمارات" : driverConfig.location}
        </p>
        <p>{isArabic ? "متاح يوميا" : driverConfig.hours}</p>
        <p>{isArabic ? "واتساب هو الأفضل لتأكيد الحجز بسرعة." : driverConfig.whatsappNote}</p>
      </div>
      <div className="footer-actions">
        <a className="button primary" href={phoneHref(driverConfig.phone)}>
          {isArabic ? "اتصال" : "Call"}
        </a>
        <a className="button" href={whatsappHref(driverConfig.phone, message)} rel="noreferrer" target="_blank">
          {isArabic ? "واتساب" : "WhatsApp"}
        </a>
      </div>
      <nav className="footer-seo-links" aria-label={isArabic ? "خدمات بيك اب شائعة" : "Popular pickup services"}>
        {featuredSeoLinks.slice(0, 4).map(({ citySlug, serviceSlug }) => {
          const city = getCity(citySlug);
          const service = getService(serviceSlug);

          if (!city || !service) {
            return null;
          }

          return (
            <Link
              href={isArabic ? `/ar/${city.slug}/${service.slug}` : `/${city.slug}/${service.slug}`}
              key={`${city.slug}-${service.slug}`}
            >
              {isArabic ? `${service.arName} ${city.arName}` : `${service.name} ${city.name}`}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
