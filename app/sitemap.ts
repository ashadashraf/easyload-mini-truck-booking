import type { MetadataRoute } from "next";
import { getSeoLandingPages } from "@/lib/seo/content";
import { getGuidePath, seoGuides } from "@/lib/seo/guides";
import { absoluteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          "en-AE": absoluteUrl("/"),
          "ar-AE": absoluteUrl("/ar"),
          "x-default": absoluteUrl("/")
        }
      }
    },
    {
      url: absoluteUrl("/ar"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.92,
      alternates: {
        languages: {
          "en-AE": absoluteUrl("/"),
          "ar-AE": absoluteUrl("/ar"),
          "x-default": absoluteUrl("/")
        }
      }
    }
  ];

  const landingPages: MetadataRoute.Sitemap = getSeoLandingPages().flatMap(({ arPath, city, enPath }) => [
    {
      url: absoluteUrl(enPath),
      lastModified,
      changeFrequency: "weekly",
      priority: city.priority,
      alternates: {
        languages: {
          "en-AE": absoluteUrl(enPath),
          "ar-AE": absoluteUrl(arPath),
          "x-default": absoluteUrl(enPath)
        }
      }
    },
    {
      url: absoluteUrl(arPath),
      lastModified,
      changeFrequency: "weekly",
      priority: Math.max(city.priority - 0.03, 0.6),
      alternates: {
        languages: {
          "en-AE": absoluteUrl(enPath),
          "ar-AE": absoluteUrl(arPath),
          "x-default": absoluteUrl(enPath)
        }
      }
    }
  ]);

  const guidePages: MetadataRoute.Sitemap = seoGuides.flatMap((guide) => {
    const enPath = getGuidePath(guide, "en");
    const arPath = getGuidePath(guide, "ar");

    return [
      {
        url: absoluteUrl(enPath),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.68,
        alternates: {
          languages: {
            "en-AE": absoluteUrl(enPath),
            "ar-AE": absoluteUrl(arPath),
            "x-default": absoluteUrl(enPath)
          }
        }
      },
      {
        url: absoluteUrl(arPath),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.65,
        alternates: {
          languages: {
            "en-AE": absoluteUrl(enPath),
            "ar-AE": absoluteUrl(arPath),
            "x-default": absoluteUrl(enPath)
          }
        }
      }
    ];
  });

  return [...staticPages, ...landingPages, ...guidePages];
}
