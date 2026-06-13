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
  },
  {
    slug: "furniture-moving-cost-dubai",
    title: "How Much Does Furniture Moving Cost in Dubai?",
    arTitle: "How Much Does Furniture Moving Cost in Dubai?",
    description: "A practical guide to the factors that affect furniture moving and pickup truck prices in Dubai.",
    arDescription: "A practical guide to the factors that affect furniture moving and pickup truck prices in Dubai.",
    sections: [
      {
        title: "Route and distance matter",
        text: "Pickup and drop-off areas affect the estimate, especially when the job crosses busy Dubai zones or requires inter-emirate travel.",
        arTitle: "Route and distance matter",
        arText: "Pickup and drop-off areas affect the estimate, especially when the job crosses busy Dubai zones or requires inter-emirate travel."
      },
      {
        title: "Load size changes the quote",
        text: "A few boxes usually cost less than sofas, wardrobes, appliances or bulky items that need careful handling.",
        arTitle: "Load size changes the quote",
        arText: "A few boxes usually cost less than sofas, wardrobes, appliances or bulky items that need careful handling."
      },
      {
        title: "Access can add time",
        text: "Tower permissions, loading bays, basement parking, lift timings and helper needs can affect the final price.",
        arTitle: "Access can add time",
        arText: "Tower permissions, loading bays, basement parking, lift timings and helper needs can affect the final price."
      }
    ]
  },
  {
    slug: "move-1-bedroom-apartment-dubai",
    title: "How to Move a 1 Bedroom Apartment in Dubai",
    arTitle: "How to Move a 1 Bedroom Apartment in Dubai",
    description: "Plan a small apartment move in Dubai with pickup timing, building access, packing and helper tips.",
    arDescription: "Plan a small apartment move in Dubai with pickup timing, building access, packing and helper tips.",
    sections: [
      {
        title: "List the main items",
        text: "Share beds, sofa sets, dining tables, wardrobes, appliances and carton counts so the driver can judge the load.",
        arTitle: "List the main items",
        arText: "Share beds, sofa sets, dining tables, wardrobes, appliances and carton counts so the driver can judge the load."
      },
      {
        title: "Confirm building rules",
        text: "Many Dubai buildings require move-in or move-out approval, lift booking or security permission before the truck arrives.",
        arTitle: "Confirm building rules",
        arText: "Many Dubai buildings require move-in or move-out approval, lift booking or security permission before the truck arrives."
      },
      {
        title: "Choose the right time",
        text: "Avoid peak traffic when possible and allow extra time for loading, unloading and elevator waiting.",
        arTitle: "Choose the right time",
        arText: "Avoid peak traffic when possible and allow extra time for loading, unloading and elevator waiting."
      }
    ]
  },
  {
    slug: "move-washing-machine-dubai",
    title: "How to Transport a Washing Machine Safely in Dubai",
    arTitle: "How to Transport a Washing Machine Safely in Dubai",
    description: "Simple steps for moving a washing machine by pickup truck without leaks, scratches or delays.",
    arDescription: "Simple steps for moving a washing machine by pickup truck without leaks, scratches or delays.",
    sections: [
      {
        title: "Drain and disconnect first",
        text: "Empty the machine, disconnect hoses and secure the cable before the pickup arrives.",
        arTitle: "Drain and disconnect first",
        arText: "Empty the machine, disconnect hoses and secure the cable before the pickup arrives."
      },
      {
        title: "Keep it upright",
        text: "A washing machine should usually travel upright and be protected from movement during loading and transport.",
        arTitle: "Keep it upright",
        arText: "A washing machine should usually travel upright and be protected from movement during loading and transport."
      },
      {
        title: "Request help if needed",
        text: "Choose helper support for stairs, tight corridors, heavy lifting or buildings without easy trolley access.",
        arTitle: "Request help if needed",
        arText: "Choose helper support for stairs, tight corridors, heavy lifting or buildings without easy trolley access."
      }
    ]
  },
  {
    slug: "best-areas-pickup-truck-dubai",
    title: "Best Areas to Book a Pickup Truck in Dubai",
    arTitle: "Best Areas to Book a Pickup Truck in Dubai",
    description: "Common Dubai areas for pickup truck bookings, from apartments and villas to shops and warehouses.",
    arDescription: "Common Dubai areas for pickup truck bookings, from apartments and villas to shops and warehouses.",
    sections: [
      {
        title: "Apartment-heavy areas",
        text: "Dubai Marina, JVC, Business Bay, Downtown Dubai and Deira often need pickups for room moves, furniture and appliances.",
        arTitle: "Apartment-heavy areas",
        arText: "Dubai Marina, JVC, Business Bay, Downtown Dubai and Deira often need pickups for room moves, furniture and appliances."
      },
      {
        title: "Commercial pickup zones",
        text: "Al Quoz, Ras Al Khor, Deira and Sharjah Industrial Area are common for shop stock, workshop items and cargo trips.",
        arTitle: "Commercial pickup zones",
        arText: "Al Quoz, Ras Al Khor, Deira and Sharjah Industrial Area are common for shop stock, workshop items and cargo trips."
      },
      {
        title: "Plan around access",
        text: "The best area is the one where parking, loading access and timing are clear before the driver reaches the location.",
        arTitle: "Plan around access",
        arText: "The best area is the one where parking, loading access and timing are clear before the driver reaches the location."
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
