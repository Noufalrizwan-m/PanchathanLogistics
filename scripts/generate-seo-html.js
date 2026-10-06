const fs = require('node:fs');
const path = require('node:path');
async function main() {
const seo = (await import('../src/lib/seoData.mjs')).default;
const output = path.resolve(__dirname, '../build');
const template = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const [route, page] of Object.entries(seo.pages)) {
  const url = seo.canonical(route);
  const tags = `<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><meta name="robots" content="index, follow"><meta name="googlebot" content="index, follow"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="${seo.SITE_NAME}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${seo.SITE_URL}/logo-480.webp"><meta property="og:locale" content="en_IN"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${seo.SITE_URL}/logo-480.webp"><script type="application/ld+json">${JSON.stringify(seo.graph(route)).replace(/</g, '\\u003c')}</script>`;
  let html = template.replace(/<title\b[^>]*>[^<]*<\/title>/g, '').replace(/<meta\b[^>]*(?:name="(?:description|robots|googlebot|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '').replace(/<link\b[^>]*rel="canonical"[^>]*>/g, '').replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '');
  html = html.replace('</head>', `${tags.replace(/<(title|meta|link|script)\b/g, '<$1 data-static-seo="true"')}</head>`);
  const file = route === '/' ? path.join(output, 'index.html') : path.join(output, route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html);
}
console.log(`Generated unique SEO metadata and structured data for ${Object.keys(seo.pages).length} production pages.`);

}
main().catch(error => { console.error(error); process.exitCode = 1; });
