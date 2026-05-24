export type Locale = "en" | "ar";

export type SeoCity = {
  slug: string;
  name: string;
  arName: string;
  region: string;
  priority: number;
  neighborhoods: string[];
  arNeighborhoods: string[];
  angle: string;
  arAngle: string;
};

export type SeoService = {
  slug: string;
  name: string;
  arName: string;
  vehicle: string;
  intent: string;
  arIntent: string;
  keywords: string[];
  arKeywords: string[];
};

export const seoCities: SeoCity[] = [
  {
    slug: "dubai",
    name: "Dubai",
    arName: "دبي",
    region: "Dubai",
    priority: 1,
    neighborhoods: ["Dubai Marina", "Business Bay", "Downtown Dubai", "JVC", "Deira", "Bur Dubai"],
    arNeighborhoods: ["دبي مارينا", "الخليج التجاري", "وسط مدينة دبي", "قرية جميرا", "ديرة", "بر دبي"],
    angle: "high-demand apartment moves, shop deliveries, furniture pickup and urgent small cargo jobs",
    arAngle: "نقل الشقق والتوصيل التجاري ونقل الأثاث والطلبات العاجلة داخل المدينة"
  },
  {
    slug: "abu-dhabi",
    name: "Abu Dhabi",
    arName: "أبوظبي",
    region: "Abu Dhabi",
    priority: 0.9,
    neighborhoods: ["Abu Dhabi City", "Mussafah", "Khalifa City", "Al Reem Island", "Yas Island"],
    arNeighborhoods: ["مدينة أبوظبي", "مصفح", "مدينة خليفة", "جزيرة الريم", "جزيرة ياس"],
    angle: "planned home shifting, office delivery, store stock movement and inter-emirate transport",
    arAngle: "نقل المنازل والمكاتب والبضائع والتنقل بين الإمارات"
  },
  {
    slug: "sharjah",
    name: "Sharjah",
    arName: "الشارقة",
    region: "Sharjah",
    priority: 0.9,
    neighborhoods: ["Al Nahda", "Muwaileh", "Industrial Area", "Al Majaz", "Rolla"],
    arNeighborhoods: ["النهدة", "مويلح", "الصناعية", "المجاز", "الرولة"],
    angle: "budget-friendly shifting, warehouse pickups, furniture delivery and family moves",
    arAngle: "نقل اقتصادي للأثاث والمستودعات وتوصيل العائلات والمتاجر"
  },
  {
    slug: "al-quoz",
    name: "Al Quoz",
    arName: "القوز",
    region: "Dubai",
    priority: 0.85,
    neighborhoods: ["Al Quoz Industrial Area", "Al Safa", "Umm Suqeim", "Al Barsha", "Oasis Mall"],
    arNeighborhoods: ["منطقة القوز الصناعية", "الصفا", "أم سقيم", "البرشاء", "واحة مول"],
    angle: "industrial pickups, workshop deliveries, furniture transport and retail stock movement",
    arAngle: "نقل صناعي وتوصيل الورش والأثاث وحركة بضائع المتاجر"
  },
  {
    slug: "ajman",
    name: "Ajman",
    arName: "عجمان",
    region: "Ajman",
    priority: 0.82,
    neighborhoods: ["Ajman Corniche", "Al Nuaimiya", "Al Rashidiya", "Ajman Industrial Area"],
    arNeighborhoods: ["كورنيش عجمان", "النعيمية", "الراشدية", "صناعية عجمان"],
    angle: "affordable pickup jobs, small apartment shifting and deliveries between Ajman and Sharjah",
    arAngle: "نقل اقتصادي للشقق الصغيرة والتوصيل بين عجمان والشارقة"
  },
  {
    slug: "al-ain",
    name: "Al Ain",
    arName: "العين",
    region: "Abu Dhabi",
    priority: 0.78,
    neighborhoods: ["Al Jimi", "Al Mutarad", "Town Centre", "Sanaiya", "Al Maqam"],
    arNeighborhoods: ["الجيمي", "المطارد", "وسط المدينة", "الصناعية", "المقام"],
    angle: "villa moves, shop deliveries, garden items and scheduled transport across Al Ain",
    arAngle: "نقل الفلل والمتاجر ومستلزمات الحدائق والنقل المجدول داخل العين"
  },
  {
    slug: "fujairah",
    name: "Fujairah",
    arName: "الفجيرة",
    region: "Fujairah",
    priority: 0.72,
    neighborhoods: ["Fujairah City", "Dibba", "Khor Fakkan", "Sakamkam", "Merashid"],
    arNeighborhoods: ["مدينة الفجيرة", "دبا", "خورفكان", "سكمكم", "مريشد"],
    angle: "coastal deliveries, furniture transport and inter-emirate mini truck jobs",
    arAngle: "توصيل ساحلي ونقل أثاث وخدمات بيك اب بين الإمارات"
  },
  {
    slug: "ras-al-khaimah",
    name: "Ras Al Khaimah",
    arName: "رأس الخيمة",
    region: "Ras Al Khaimah",
    priority: 0.72,
    neighborhoods: ["RAK City", "Al Hamra", "Nakheel", "Al Dhait", "Julphar"],
    arNeighborhoods: ["مدينة رأس الخيمة", "الحمرا", "النخيل", "الظيت", "جلفار"],
    angle: "home shifting, commercial deliveries, furniture pickup and long-distance UAE transport",
    arAngle: "نقل المنازل والتوصيل التجاري ونقل الأثاث والرحلات الطويلة داخل الإمارات"
  },
  {
    slug: "umm-al-quwain",
    name: "Umm Al Quwain",
    arName: "أم القيوين",
    region: "Umm Al Quwain",
    priority: 0.7,
    neighborhoods: ["UAQ City", "Al Salamah", "Falaj Al Mualla", "Industrial Area"],
    arNeighborhoods: ["مدينة أم القيوين", "السلامة", "فلج المعلا", "الصناعية"],
    angle: "small cargo moves, shop deliveries and scheduled pickup trips across the northern emirates",
    arAngle: "نقل البضائع الصغيرة وتوصيل المتاجر والرحلات المجدولة في الإمارات الشمالية"
  }
];

export const seoServices: SeoService[] = [
  {
    slug: "pickup-truck-service",
    name: "Pickup Truck Service",
    arName: "خدمة بيك اب",
    vehicle: "1 ton pickup",
    intent: "book a pickup truck for shifting, delivery, furniture, boxes and shop items",
    arIntent: "حجز سيارة بيك اب لنقل الأثاث والصناديق والبضائع ومستلزمات المتاجر",
    keywords: ["pickup service", "pickup truck service", "mini truck booking", "cargo pickup service"],
    arKeywords: ["خدمة بيك اب", "بيك اب دبي", "نقل بيك اب", "سيارة نقل"]
  },
  {
    slug: "moving-service",
    name: "Moving Service",
    arName: "خدمة نقل الأثاث",
    vehicle: "mini truck",
    intent: "move apartments, rooms, furniture, appliances and personal items with a simple booking flow",
    arIntent: "نقل الشقق والغرف والأثاث والأجهزة والأغراض الشخصية بطريقة حجز سهلة",
    keywords: ["moving service", "shifting service", "furniture moving", "movers"],
    arKeywords: ["نقل اثاث", "نقل اثاث دبي", "نقل عفش", "شركة نقل"]
  },
  {
    slug: "1-ton-pickup",
    name: "1 Ton Pickup",
    arName: "بيك اب 1 طن",
    vehicle: "1 ton pickup",
    intent: "transport medium-size loads, cartons, furniture, store supplies and delivery items",
    arIntent: "نقل الأحمال المتوسطة والكرتون والأثاث وبضائع المتاجر",
    keywords: ["1 ton pickup", "1 ton pickup service", "one ton pickup", "truck rental"],
    arKeywords: ["بيك اب 1 طن", "ونيت 1 طن", "شاحنة نقل صغيرة", "نقل 1 طن"]
  },
  {
    slug: "movers",
    name: "Movers",
    arName: "عمال نقل",
    vehicle: "1 ton pickup with helper option",
    intent: "arrange moving support for loading, unloading and safe transport",
    arIntent: "ترتيب دعم للنقل والتحميل والتنزيل والتوصيل الآمن",
    keywords: ["movers", "movers near me", "shifting helpers", "furniture movers"],
    arKeywords: ["عمال نقل", "نقل اثاث مع عمال", "تحميل وتنزيل", "عمال نقل عفش"]
  },
  {
    slug: "cargo-transport",
    name: "Cargo Transport",
    arName: "نقل بضائع",
    vehicle: "mini truck cargo pickup",
    intent: "send cargo, boxes, retail stock, event items and business deliveries",
    arIntent: "إرسال البضائع والصناديق ومخزون المتاجر ومستلزمات الفعاليات",
    keywords: ["cargo transport", "cargo pickup", "delivery truck", "transport service"],
    arKeywords: ["نقل بضائع", "خدمة نقل", "نقل تجاري", "شاحنة نقل دبي"]
  }
];

export function getCity(slug: string) {
  return seoCities.find((city) => city.slug === slug);
}

export function getService(slug: string) {
  return seoServices.find((service) => service.slug === slug);
}

export function getSeoLandingPages() {
  return seoCities.flatMap((city) =>
    seoServices.map((service) => ({
      city,
      service,
      enPath: `/${city.slug}/${service.slug}`,
      arPath: `/ar/${city.slug}/${service.slug}`
    }))
  );
}

export const featuredSeoLinks = [
  { citySlug: "dubai", serviceSlug: "pickup-truck-service" },
  { citySlug: "dubai", serviceSlug: "1-ton-pickup" },
  { citySlug: "al-quoz", serviceSlug: "pickup-truck-service" },
  { citySlug: "sharjah", serviceSlug: "movers" },
  { citySlug: "abu-dhabi", serviceSlug: "cargo-transport" },
  { citySlug: "ajman", serviceSlug: "moving-service" }
];
