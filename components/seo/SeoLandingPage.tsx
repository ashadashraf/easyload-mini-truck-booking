import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { driverConfig } from "@/lib/config";
import { phoneHref, whatsappHref } from "@/lib/driver";
import type { Locale, SeoCity, SeoService } from "@/lib/seo/content";
import { featuredSeoLinks, getCity, getService, seoServices } from "@/lib/seo/content";
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
  websiteSchema,
  type QuestionAnswer
} from "@/lib/seo/schema";
import { JsonLd } from "./JsonLd";

export function SeoLandingPage({
  city,
  locale,
  service
}: {
  city: SeoCity;
  locale: Locale;
  service: SeoService;
}) {
  const isArabic = locale === "ar";
  const path = isArabic ? `/ar/${city.slug}/${service.slug}` : `/${city.slug}/${service.slug}`;
  const vehicleLabel = isArabic ? getArabicVehicleLabel(service) : service.vehicle;
  const whatsappMessage = isArabic
    ? `مرحبا ${driverConfig.name}، أريد حجز ${service.arName} في ${city.arName}.`
    : `Hello ${driverConfig.name}, I want to book ${service.name} in ${city.name}.`;
  const faqs = buildFaqs(city, service, locale);
  const title = isArabic ? `${service.arName} في ${city.arName}` : `${service.name} in ${city.name}`;

  return (
    <main className="shell seo-page" lang={isArabic ? "ar" : "en"} dir={isArabic ? "rtl" : "ltr"}>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd
        data={serviceSchema({
          city,
          locale,
          path,
          service
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: isArabic ? "الرئيسية" : "Home", path: isArabic ? "/ar" : "/" },
          { name: isArabic ? city.arName : city.name, path },
          { name: isArabic ? service.arName : service.name, path }
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="container">
        <AppHeader
          brandHref={isArabic ? "/ar" : "/"}
          bookHref={isArabic ? "/ar#booking" : "/#booking"}
          languageHref={isArabic ? `/${city.slug}/${service.slug}` : `/ar/${city.slug}/${service.slug}`}
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

        <section className="seo-hero">
          <div className="seo-hero-copy">
            <nav className="seo-breadcrumb" aria-label={isArabic ? "مسار الصفحة" : "Breadcrumb"}>
              <Link href={isArabic ? "/ar" : "/"}>{isArabic ? "الرئيسية" : "Home"}</Link>
              <span aria-hidden="true">/</span>
              <span>{isArabic ? city.arName : city.name}</span>
            </nav>
            <span className="eyebrow">{isArabic ? "متوفر في جميع أنحاء الإمارات" : "Available across UAE"}</span>
            <h1>{title}</h1>
            <p>
              {isArabic
                ? `${service.arName} في ${city.arName} لحجز ${vehicleLabel} بسرعة لنقل الأثاث والصناديق والبضائع. احصل على تقدير سعر واضح وتواصل مباشر عبر واتساب للتأكيد.`
                : `Book ${service.name.toLowerCase()} in ${city.name} for ${service.intent}. PickUp DXB helps customers arrange a reliable ${service.vehicle} with a clear estimate, call support and WhatsApp confirmation.`}
            </p>
            <div className="seo-cta-row">
              <Link className="button primary" href={isArabic ? "/ar#booking" : "/#booking"}>
                {isArabic ? "احجز الآن" : "Book now"}
              </Link>
              <a className="button" href={whatsappHref(driverConfig.phone, whatsappMessage)} rel="noreferrer" target="_blank">
                {isArabic ? "واتساب" : "WhatsApp"}
              </a>
              <a className="button" href={phoneHref(driverConfig.phone)}>
                {isArabic ? "اتصال" : "Call"}
              </a>
            </div>
          </div>

          <aside className="seo-trust-panel" aria-label={isArabic ? "مميزات الخدمة" : "Service highlights"}>
            <strong>{vehicleLabel}</strong>
            <ul>
              <li>{isArabic ? "تقدير سعر قبل التأكيد" : "Estimate before confirmation"}</li>
              <li>{isArabic ? "خيار مساعد للتحميل والتنزيل" : "Helper option for loading/unloading"}</li>
              <li>{isArabic ? "تواصل مباشر عبر واتساب" : "Direct WhatsApp coordination"}</li>
              <li>{isArabic ? "تغطية داخل الإمارات" : "UAE-wide coverage"}</li>
            </ul>
          </aside>
        </section>

        <section className="seo-content-grid">
          <article className="panel seo-copy-block">
            <span className="eyebrow">{isArabic ? "خدمة محلية" : "Local service"}</span>
            <h2>
              {isArabic
                ? `حجز ${service.arName} في ${city.arName} بدون تعقيد`
                : `Fast ${service.name.toLowerCase()} for ${city.name} jobs`}
            </h2>
            <p>
              {isArabic
                ? `PickUp DXB يساعدك في ترتيب ${service.arName} في ${city.arName} للطلبات اليومية مثل نقل الأثاث، توصيل الصناديق، نقل مستلزمات المتاجر، والرحلات بين مناطق الإمارات. الخدمة مناسبة لمن يريد حجزا واضحا وسريعا بدون خطوات معقدة.`
                : `PickUp DXB is built for practical transport jobs in ${city.name}: ${city.angle}. The booking flow keeps the important decisions simple: pickup point, drop-off point, timing, contact number, helper need and notes about the items.`}
            </p>
            <p>
              {isArabic
                ? `يمكنك إدخال موقع الاستلام والتسليم، الوقت المناسب، رقم التواصل، ووصف الأغراض. بعد ذلك يظهر تقدير السعر ويمكنك تأكيد التفاصيل مباشرة مع السائق عبر واتساب أو الاتصال.`
                : `Enter the pickup and drop locations, add the time, describe the items and get an estimated price before speaking with the driver. The final booking is coordinated directly so customers can confirm access, parking, helper needs and timing.`}
            </p>
          </article>

          <article className="panel seo-copy-block">
            <span className="eyebrow">{isArabic ? "المناطق القريبة" : "Nearby areas"}</span>
            <h2>{isArabic ? `مناطق نخدمها في ${city.arName}` : `Areas covered around ${city.name}`}</h2>
            <div className="seo-pill-grid">
              {(isArabic ? city.arNeighborhoods : city.neighborhoods).map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </article>
        </section>

        <section className="promo-section" aria-labelledby="seo-guides-title">
          <div className="section-title">
            <span className="eyebrow">{isArabic ? "دليل سريع" : "Quick guide"}</span>
            <h2 id="seo-guides-title">{isArabic ? "كيف تجعل النقل أسرع وأسهل؟" : "How to make your pickup job smoother"}</h2>
          </div>
          <div className="feature-grid seo-feature-grid">
            {(isArabic ? arabicGuides : englishGuides).map((guide, index) => (
              <article className="feature-card" key={guide.title}>
                <span className="feature-icon">{String(index + 1).padStart(2, "0")}</span>
                <h3>{guide.title}</h3>
                <p>{guide.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel seo-faq" aria-labelledby="seo-faq-title">
          <div className="section-title">
            <span className="eyebrow">{isArabic ? "الأسئلة الشائعة" : "FAQ"}</span>
            <h2 id="seo-faq-title">{isArabic ? "أسئلة شائعة" : "Frequently asked questions"}</h2>
          </div>
          <div className="seo-faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="panel seo-links" aria-labelledby="seo-links-title">
          <div className="section-title">
            <span className="eyebrow">{isArabic ? "خدمات أخرى" : "More UAE routes"}</span>
            <h2 id="seo-links-title">{isArabic ? "روابط مفيدة للحجز" : "Useful booking pages"}</h2>
          </div>
          <div className="seo-link-grid">
            {buildRelatedLinks(city, service, locale).map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <AppFooter locale={locale} />
      </div>
    </main>
  );
}

const englishGuides = [
  {
    title: "Measure the load",
    text: "Mention large items, boxes, appliances and fragile pieces so the driver can prepare the pickup properly."
  },
  {
    title: "Share access details",
    text: "Building access, parking, lift timing and loading area details help avoid delays during shifting."
  },
  {
    title: "Confirm helper needs",
    text: "If items are heavy or upstairs, choose the helper option so loading and unloading can be planned."
  },
  {
    title: "Keep WhatsApp ready",
    text: "Use WhatsApp for route pins, item photos and quick final confirmation with the driver."
  }
];

const arabicGuides = [
  {
    title: "حدد حجم الحمولة",
    text: "اذكر الأثاث الكبير والصناديق والأجهزة والأغراض القابلة للكسر حتى يتم تجهيز البيك اب بشكل مناسب."
  },
  {
    title: "شارك تفاصيل الدخول",
    text: "مواقف التحميل والمصعد وتصاريح الدخول تساعد على تقليل التأخير وقت النقل."
  },
  {
    title: "أكد الحاجة إلى مساعد",
    text: "إذا كانت الأغراض ثقيلة أو في طابق مرتفع، اختر خيار المساعد للتخطيط للتحميل والتنزيل."
  },
  {
    title: "استخدم واتساب",
    text: "واتساب مناسب لإرسال الموقع والصور وتأكيد السعر النهائي بسرعة مع السائق."
  }
];

function buildFaqs(city: SeoCity, service: SeoService, locale: Locale): QuestionAnswer[] {
  if (locale === "ar") {
    return [
      {
        question: `هل تتوفر ${service.arName} في ${city.arName}؟`,
        answer: `نعم، PickUp DXB يوفر ${service.arName} في ${city.arName} والمناطق القريبة حسب توفر السائق والوقت المطلوب.`
      },
      {
        question: "هل يمكن معرفة السعر قبل الحجز؟",
        answer: "نعم، يمكنك إدخال موقع الاستلام والتسليم للحصول على تقدير سعر مبدئي، ثم تأكيد السعر النهائي مع السائق."
      },
      {
        question: "هل يوجد مساعد للتحميل والتنزيل؟",
        answer: "يمكنك اختيار الحاجة إلى مساعد أثناء الحجز، وسيتم تنسيق تكلفة المساعد والتفاصيل مع السائق."
      },
      {
        question: "هل يمكن الحجز عبر واتساب؟",
        answer: "نعم، بعد إدخال تفاصيل الحجز يمكنك التواصل عبر واتساب لتأكيد الموقع والوقت والأغراض."
      }
    ];
  }

  return [
    {
      question: `Is ${service.name.toLowerCase()} available in ${city.name}?`,
      answer: `Yes. PickUp DXB supports ${service.name.toLowerCase()} in ${city.name} and nearby areas based on driver availability and the requested time.`
    },
    {
      question: "Can I see the estimated price before booking?",
      answer: "Yes. Enter pickup and drop-off locations to see an estimated price, then confirm the final price directly with the driver."
    },
    {
      question: "Can I request loading and unloading help?",
      answer: "Yes. Choose the helper option in the booking form if the job needs support for lifting, loading or unloading."
    },
    {
      question: "Can I confirm the booking on WhatsApp?",
      answer: "Yes. PickUp DXB is WhatsApp-first, so customers can share pins, photos, timing and final instructions with the driver."
    }
  ];
}

function buildRelatedLinks(city: SeoCity, service: SeoService, locale: Locale) {
  const isArabic = locale === "ar";
  const sameCity = seoServices
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3)
    .map((item) => ({
      href: isArabic ? `/ar/${city.slug}/${item.slug}` : `/${city.slug}/${item.slug}`,
      label: isArabic ? `${item.arName} في ${city.arName}` : `${item.name} in ${city.name}`
    }));

  const featured = featuredSeoLinks
    .map(({ citySlug, serviceSlug }) => {
      const linkedCity = getCity(citySlug);
      const linkedService = getService(serviceSlug);

      if (!linkedCity || !linkedService || (linkedCity.slug === city.slug && linkedService.slug === service.slug)) {
        return null;
      }

      return {
        href: isArabic ? `/ar/${linkedCity.slug}/${linkedService.slug}` : `/${linkedCity.slug}/${linkedService.slug}`,
        label: isArabic
          ? `${linkedService.arName} في ${linkedCity.arName}`
          : `${linkedService.name} in ${linkedCity.name}`
      };
    })
    .filter((item): item is { href: string; label: string } => Boolean(item))
    .slice(0, 5);

  return dedupeLinks([
    {
      href: isArabic ? "/ar#booking" : "/#booking",
      label: isArabic ? "احجز الآن من الصفحة الرئيسية" : "Book now from the main booking page"
    },
    ...sameCity,
    ...featured
  ]);
}

function getArabicVehicleLabel(service: SeoService) {
  if (service.slug === "movers") {
    return "بيك اب 1 طن مع خيار مساعد";
  }

  if (service.slug === "cargo-transport") {
    return "بيك اب لنقل البضائع";
  }

  if (service.slug === "moving-service") {
    return "شاحنة صغيرة";
  }

  return "بيك اب 1 طن";
}

function dedupeLinks(links: Array<{ href: string; label: string }>) {
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  });
}
