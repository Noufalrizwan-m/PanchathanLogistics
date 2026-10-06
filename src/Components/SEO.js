import { useLayoutEffect } from 'react';
import seoData from '../lib/seoData.mjs';
import { Helmet } from 'react-helmet-async';

const SITE_URL = seoData.SITE_URL;
const DEFAULT_IMAGE = `${SITE_URL}/logo-480.webp`;
const SITE_NAME = 'Panchathan Logistics';

function SEO({
  title,
  description,
  keywords,
  path = '/',
  image = DEFAULT_IMAGE,
  jsonLd,
}) {
  // React 19 hoists these tags itself. Remove the initial HTML fallbacks once
  // the page metadata is mounted, so client navigation never leaves duplicates.
  useLayoutEffect(() => {
    document.head.querySelectorAll('[data-static-seo]').forEach(element => element.remove());
  }, []);
  const page = seoData.pages[path];
  title = page?.title || title || SITE_NAME;
  description = page?.description || description;
  jsonLd = page ? seoData.graph(path) : jsonLd;
  const canonical = seoData.canonical(path);
  const robots = page ? 'index, follow' : 'noindex, follow';
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export default SEO;
