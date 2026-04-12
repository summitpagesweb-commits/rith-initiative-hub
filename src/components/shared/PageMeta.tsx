import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogImageAlt?: string;
  type?: string;
  keywords?: string;
  robots?: string;
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  articlePublishedTime?: string;
  articleModifiedTime?: string;
}

const BASE_URL = "https://rithinitiative.org";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const DEFAULT_OG_IMAGE_ALT = "The Rith Initiative - Exploring Indian Wisdom & Culture";
const BASE_KEYWORDS = "Indian American nonprofit, Indian culture Virginia, Indian arts foundation, Indian heritage, South Asian cultural organization";

export function PageMeta({
  title,
  description,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
  type = "website",
  keywords,
  robots,
  noindex = false,
  nofollow = false,
  jsonLd,
  articlePublishedTime,
  articleModifiedTime,
}: PageMetaProps) {
  const normalizedPath = path && path !== "/" ? `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}` : "";
  const fullTitle = normalizedPath === "" ? title : `${title} | The Rith Initiative`;
  const canonicalUrl = `${BASE_URL}${normalizedPath}`;
  const allKeywords = keywords ? `${keywords}, ${BASE_KEYWORDS}` : BASE_KEYWORDS;
  const robotsContent = robots ??
    `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content="The Rith Initiative" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="alternate" hrefLang="en-US" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content="The Rith Initiative" />
      <meta property="og:locale" content="en_US" />
      {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}

      {/* JSON-LD */}
      {schemas.map((schema, index) => (
        <script key={`schema-${index}`} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
}
