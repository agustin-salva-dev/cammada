import { siteConfig } from "@/config/site";

export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    description: siteConfig.description,
    sport: ["Artes Marciales Mixtas", "Kickboxing", "Grappling"],
    location: {
      "@type": "Place",
      name: "Salta Capital",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.location.ciudad,
        addressRegion: siteConfig.location.provincia,
        addressCountry: "AR",
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: "Spanish",
    },
    foundingDate: String(siteConfig.foundedYear),
    ...(siteConfig.socialLinks.instagram && {
      sameAs: [
        siteConfig.socialLinks.instagram,
        ...(siteConfig.socialLinks.youtube
          ? [siteConfig.socialLinks.youtube]
          : []),
        ...(siteConfig.socialLinks.tiktok
          ? [siteConfig.socialLinks.tiktok]
          : []),
      ].filter(Boolean),
    }),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "es-AR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/luchadores?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
