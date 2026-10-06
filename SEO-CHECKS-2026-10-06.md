# Chennai SEO and page checks — 6 October 2026

The existing design, layouts, colours, animations and sections are preserved. Changes are limited to SEO, wording in existing asset-service descriptions, and internal reliability/performance fixes.

## Search content implemented

Primary focus: IT asset management in Chennai. Related searches: laptop logistics Chennai, laptop transport Chennai, computer transport Chennai, desktop and server logistics Chennai, IT equipment logistics Chennai, courier and cargo Chennai.

This is equipment logistics and asset tracking, not financial asset management or a software inventory product. No new claims about data wiping, disposal, certifications, equipment repair, guaranteed delivery or specific security certifications were added.

- Home: title and description explain IT asset management and laptop logistics in Chennai. Existing asset/technology descriptions now explicitly mention laptops, desktops, servers and business equipment.
- Services: asset-management card describes the equipment and service location. Freight, customs, warehousing and surface-transport content remains in the original bento layout.
- About: metadata identifies the Chennai business, its founding year and IT asset logistics.
- Contact: metadata targets Chennai inquiries for IT assets, laptop transport and cargo quotes.
- Tracking: metadata accurately describes AWB tracking.
- Privacy: separate title, description and canonical URL.

## Technical SEO implemented

- Unique page titles, descriptions, canonical URLs, Open Graph and Twitter metadata.
- One shared metadata source for React and generated production HTML.
- Initial HTML metadata and JSON-LD generated for six public routes during every production build. These are metadata snapshots, not server-rendered page bodies.
- Marked initial tags removed after React mounts to avoid duplicate metadata during navigation.
- Standard LocalBusiness schema replaces the nonstandard LogisticsBusiness type. Includes Chennai postal address, existing business contact details and displayed office hours.
- WebSite, WebPage/AboutPage/ContactPage, breadcrumbs and Service/OfferCatalog graphs, with one stable business identity.
- No fabricated aggregate ratings or hidden FAQ content in structured data.
- Sitemap includes the privacy page; robots.txt points to the sitemap.
- Not-found view uses noindex. The production host must also return a real HTTP 404 for unknown URLs.

## Loading and reliability fixes

- Existing Google reviews are loaded only when their section approaches the viewport, reducing initial third-party work.
- Header uses the same logo as a smaller WebP image with explicit dimensions.
- Font connection hints reduce connection setup; existing fonts are retained.
- Delivery-area requests have a 15-second timeout and cancel when leaving the page.
- Malformed URL fragments no longer throw a decoding error.
- Original hero scroll and first-visit counters remain.

## Browser verification

All five main pages checked at 320, 390, 768, 1024 and 1440 pixels:

- No page-wide horizontal overflow.
- One H1, one description and one canonical per page.
- One parseable JSON-LD graph per page.
- No broken loaded images or new runtime errors in the checked navigation run.

A short local development homepage sample recorded 97 frame intervals over about 1.6 seconds, with no frames over 50ms. DOM-ready was 260ms and load was 370ms on that warm local run. Startup had two main-thread tasks of 110ms and 64ms. These are development observations, not Lighthouse scores or production Core Web Vitals; internet connections, devices, hosting, font delivery and the review provider will change results. Temporary measuring code was removed.

## Deployment and outside checks still needed

1. Deploy the complete build folder. The host must serve each route's generated index.html before its SPA fallback. If every route is rewritten directly to the root index.html, raw-HTML previews will use homepage metadata instead.
2. Confirm the real canonical domain and redirect its www/non-www alternative consistently.
3. Verify domain ownership in Google Search Console, submit sitemap.xml and inspect the published home/services URLs. Localhost cannot appear in public search results.
4. Confirm the existing Google Business Profile's Chennai address and service information. No profile/account edits were performed.
5. Measure production mobile Core Web Vitals after deployment. Google can render JavaScript, but fully pre-rendered or server-rendered body content remains a possible later improvement without altering the design.
6. Activate inquiry email credentials and confirm delivery in both inboxes. Tests use a stub provider.
7. Provide a valid AWB to verify successful tracking against the external shipment backend. Its earlier response for a fictitious number was HTTP 500; that backend is outside this repository.

SEO changes improve relevance and crawlability. They do not guarantee rankings for generic asset-management searches or a particular Google position.

References: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Google LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business).
