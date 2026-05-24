import type { Locale } from "./content";

export type SeoGuide = {
  slug: string;
  title: string;
  arTitle: string;
  description: string;
  arDescription: string;
  sections: Array<{
    title: string;
    text: string;
    arTitle: string;
    arText: string;
  }>;
};

export const seoGuides: SeoGuide[] = [
  {
    slug: "moving-checklist-uae",
    title: "UAE Moving Checklist for Mini Truck Bookings",
    arTitle: "قائمة تجهيز النقل في الإمارات",
    description: "A practical checklist for preparing furniture, boxes, access and timing before booking a mini truck in the UAE.",
    arDescription: "قائمة عملية لتجهيز الأثاث والصناديق والدخول والوقت قبل حجز بيك اب أو شاحنة صغيرة في الإمارات.",
    sections: [
      {
        title: "Prepare item photos",
        text: "Take clear photos of large furniture, appliances and fragile items so the driver can understand the load before arrival.",
        arTitle: "جهز صور الأغراض",
        arText: "التقط صورا واضحة للأثاث الكبير والأجهزة والأغراض القابلة للكسر حتى يفهم السائق حجم الحمولة قبل الوصول."
      },
      {
        title: "Check access and parking",
        text: "Confirm lift timings, loading bay access, parking rules and security permission before the pickup time.",
        arTitle: "تأكد من الدخول والمواقف",
        arText: "تأكد من مواعيد المصعد ومكان التحميل وقوانين المواقف وتصريح الأمن قبل موعد النقل."
      },
      {
        title: "Label boxes",
        text: "Group boxes by room or priority. This makes unloading faster and reduces confusion at the drop-off location.",
        arTitle: "اكتب على الصناديق",
        arText: "رتب الصناديق حسب الغرفة أو الأولوية لتسهيل التنزيل وتقليل الارتباك في موقع التسليم."
      }
    ]
  },
  {
    slug: "1-ton-pickup-guide",
    title: "What Fits in a 1 Ton Pickup in UAE?",
    arTitle: "ماذا يمكن نقل بيك اب 1 طن في الإمارات؟",
    description: "Understand common 1 ton pickup use cases for furniture, boxes, shop items and small cargo jobs.",
    arDescription: "تعرف على الاستخدامات الشائعة لبيك اب 1 طن لنقل الأثاث والصناديق وبضائع المتاجر والحمولات الصغيرة.",
    sections: [
      {
        title: "Best use cases",
        text: "A 1 ton pickup is useful for room shifting, small apartment moves, appliances, cartons and retail stock delivery.",
        arTitle: "أفضل الاستخدامات",
        arText: "بيك اب 1 طن مناسب لنقل الغرف والشقق الصغيرة والأجهزة والكرتون وبضائع المتاجر."
      },
      {
        title: "When to request a helper",
        text: "Choose helper support when items are heavy, bulky, upstairs or difficult to move safely by one person.",
        arTitle: "متى تحتاج إلى مساعد؟",
        arText: "اختر مساعدا عندما تكون الأغراض ثقيلة أو كبيرة أو في طابق مرتفع أو يصعب نقلها بأمان بواسطة شخص واحد."
      },
      {
        title: "Share item details early",
        text: "Mention beds, sofas, wardrobes, refrigerators and fragile pieces during booking to avoid delays.",
        arTitle: "شارك تفاصيل الأغراض مبكرا",
        arText: "اذكر الأسرة والكنب والخزائن والثلاجات والأغراض القابلة للكسر أثناء الحجز لتجنب التأخير."
      }
    ]
  },
  {
    slug: "furniture-moving-dubai",
    title: "Furniture Moving in Dubai: Pickup Booking Tips",
    arTitle: "نقل أثاث دبي: نصائح حجز البيك اب",
    description: "Tips for booking furniture pickup in Dubai, including access, timing, building rules and helper planning.",
    arDescription: "نصائح لحجز بيك اب لنقل الأثاث في دبي، تشمل الدخول والتوقيت وقوانين المبنى وخيار المساعد.",
    sections: [
      {
        title: "Book around building rules",
        text: "Many Dubai towers have moving hours or loading bay rules. Confirm them before setting pickup time.",
        arTitle: "احجز حسب قوانين المبنى",
        arText: "العديد من أبراج دبي لديها أوقات نقل أو قوانين للتحميل. تأكد منها قبل تحديد موعد الاستلام."
      },
      {
        title: "Protect fragile furniture",
        text: "Wrap glass, mirrors, tables and electronics before the truck arrives to reduce waiting time.",
        arTitle: "احم الأثاث القابل للكسر",
        arText: "غلف الزجاج والمرايا والطاولات والإلكترونيات قبل وصول البيك اب لتقليل وقت الانتظار."
      },
      {
        title: "Use WhatsApp for pins",
        text: "Send exact pickup and drop-off pins on WhatsApp so the driver can reach the correct entrance.",
        arTitle: "استخدم واتساب لإرسال الموقع",
        arText: "أرسل موقع الاستلام والتسليم بدقة عبر واتساب حتى يصل السائق إلى المدخل الصحيح."
      }
    ]
  }
];

export function getGuide(slug: string) {
  return seoGuides.find((guide) => guide.slug === slug);
}

export function getGuidePath(guide: SeoGuide, locale: Locale) {
  return locale === "ar" ? `/ar/guides/${guide.slug}` : `/guides/${guide.slug}`;
}
