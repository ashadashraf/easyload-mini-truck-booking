import type { Metadata } from "next";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { getSeoLandingPages } from "@/lib/seo/content";

export const metadata: Metadata = {
  title: "Search PickUp DXB",
  robots: {
    index: false,
    follow: true
  }
};

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q || "").trim().toLowerCase();
  const pages = getSeoLandingPages();
  const results = query
    ? pages.filter(({ city, service }) => {
        const haystack = [
          city.name,
          city.arName,
          city.neighborhoods.join(" "),
          city.arNeighborhoods.join(" "),
          service.name,
          service.arName,
          service.keywords.join(" "),
          service.arKeywords.join(" ")
        ].join(" ").toLowerCase();

        return haystack.includes(query);
      })
    : pages.slice(0, 12);

  return (
    <main className="shell">
      <div className="container">
        <AppHeader languageHref="/ar" languageLabel="العربية" />
        <section className="panel seo-links" aria-labelledby="search-title">
          <div className="section-title">
            <span className="eyebrow">Search</span>
            <h1 id="search-title">Find pickup and moving services</h1>
            <p className="muted">
              {query ? `Showing service pages matching "${query}".` : "Browse popular PickUp DXB service pages."}
            </p>
          </div>
          <div className="seo-link-grid">
            {results.slice(0, 24).map(({ city, enPath, service }) => (
              <Link href={enPath} key={enPath}>
                {service.name} in {city.name}
              </Link>
            ))}
          </div>
        </section>
        <AppFooter />
      </div>
    </main>
  );
}
