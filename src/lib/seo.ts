export const SITE_URL = "https://rithinitiative.org";
export const SITE_NAME = "The Rith Initiative";
export const SITE_DESCRIPTION =
  "A 501(c)(3) Indian American nonprofit fostering conscious living through Indian arts, cultural events, festivals, and community programming in Virginia.";

const normalizePath = (path = "") => {
  if (!path || path === "/") return "";
  return `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

export const absoluteUrl = (path = "") => `${SITE_URL}${normalizePath(path)}`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NonprofitOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Rith Initiative",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "2024",
  areaServed: {
    "@type": "State",
    name: "Virginia",
    containedInPlace: { "@type": "Country", name: "United States" },
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "VA",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/rithinitiative/",
    "https://www.facebook.com/p/The-Rith-Initiative-61580213405598/",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en-US",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
};

interface WebPageSchemaInput {
  title: string;
  description: string;
  path?: string;
  type?: string;
}

export const createWebPageSchema = ({
  title,
  description,
  path = "",
  type = "WebPage",
}: WebPageSchemaInput) => {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
};

interface BreadcrumbItem {
  name: string;
  path: string;
}

export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
