import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://therithinitiative.org";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function PageMeta({
  title,
  description,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  type = "website",
  jsonLd,
}: PageMetaProps) {
  const fullTitle = path === "" ? title : `${title} | The Rith Initiative`;
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
