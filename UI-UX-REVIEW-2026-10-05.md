# Panchathan Logistics — UI and UX review

Reviewed 5 October 2026 at http://localhost:3000/.

## Verdict

The green and amber identity, clear page structure, and visible tracking tool provide a good foundation. The site needs functional and accessibility fixes before it can be considered ready for customers. Its strongest visual improvements would be consistent spacing, less animation, clearer customer actions, and more authentic logistics imagery.

This was a review; application files were not changed.

## Scope and evidence

- Opened Home, Services, Tracking, About, and Contact in the browser.
- Checked each route at widths of 320, 390, 768, 1024, and 1440 pixels for page width, heading placement, and loaded-image failures. These 25 checks were layout smoke checks, with additional screenshots and interaction inspection at selected phone, tablet, and desktop sizes.
- Visually inspected page openings, homepage content, the service library, contact layout, and reviews. Examined the source to establish causes and identify accessibility and loading concerns.
- Tested the mobile menu and Escape, contact form failure, pincode lookup and short-input validation, invalid tracking, and document search.
- The preferred agent-browser command was unavailable; browser inspection used the available in-app browser instead.
- This is not a physical iPhone/Android test, a cross-browser certification, an automated accessibility certification, or a production performance benchmark. A valid shipment reference was not supplied, so successful tracking, timeline, copy, and delivery-result states remain unverified.

## Confirmed functional and interaction findings

| Priority | Finding and evidence | Recommended action |
|---|---|---|
| P1 | **Quote requests cannot be delivered.** The Contact page contains `YOUR_WEB3FORMS_ACCESS_KEY`. A completed local test form returned the error state before making a delivery request. | Configure the intended delivery service, then verify an actual test inquiry reaches the business inbox. Test success, failure, retry, and duplicate-submit prevention. |
| P1 | **Pincode failures can falsely claim no coverage.** Source inspection shows network/server/parse failures all become an empty result, which displays “Service Unavailable” and “We don't currently deliver…” | Separate confirmed no-service results from temporary lookup errors. Offer Retry and Call support for failures. This failure path was source-confirmed, not forced in the browser. |
| P1 | **Some primary interactions are inaccessible to keyboard users.** Homepage service shortcuts are clickable divs; branch markers are hover-only divs. | Make service cards real links. Make map markers named buttons and provide a readable branch list. |
| P1 | **Forms and icon buttons have missing accessible names.** All five Contact controls have zero associated labels. Tracking's search button is unnamed; the homepage search text disappears at desktop widths. | Associate labels using `id`/`htmlFor`, provide persistent labels for search inputs, and name icon-only buttons. Add status announcements. |
| P2 | **Tracking exposes a technical server error.** Searching `UI-REVIEW-NOT-A-SHIPMENT` returned HTTP 500 and displayed “HTTP error! Status: 500. Could not reach tracking server.” | Handle invalid references separately from server failures. Show plain-language guidance and retry/support actions. Investigate the server response. This does not establish whether valid AWBs work. |
| P2 | **Tracking and pincode search are ambiguous.** Two fields share one Search button without explaining that either may be used. If both are filled, the implementation prioritizes AWB and clears pincode. | Use two clearly named tabs or separate tools: “Track shipment” and “Check delivery area.” Explain AWB as the tracking number on the receipt. |
| P2 | **A one-digit pincode enables Search.** The field limits characters to six digits but accepts shorter values for lookup. | Require exactly six digits, show an inline explanation, and request a numeric phone keyboard using `inputMode`. |
| P2 | **Menu and result overlays lack complete keyboard handling.** Escape did not close the mobile menu. Source has no focus trap, dialog semantics, focus restoration, or menu `aria-expanded`. The pincode result leaves focus on the underlying Search button. | Add accessible overlay behavior, hide/inert underlying content while open, move focus inside, close on Escape, and return focus to the trigger. |
| P2 | **Main phone and email details are plain text.** Contact cards, branch cards, and footer do not offer direct phone/email actions. | Add `tel:` and `mailto:` links. Give branches a Directions link and make emergency/support hours clear. |
| P2 | **Mobile hides the main quote action inside the menu.** The homepage opening has tracking but no visible quote/pickup action below the desktop breakpoint. | Add a visible “Get a Quote” or “Book a Pickup” action in the hero, alongside tracking. |
| P2 | **Homepage overrides ordinary scrolling.** Its wheel handler jumps from anywhere inside the hero to the next section and blocks additional wheel input during a 900 ms lock. Touch gestures also trigger automatic jumps. | Restore native scrolling. Retain an optional explicit scroll-down control if desired. |
| P2 | **A resize triggered a development error overlay.** After changing desktop to 320 px near the lower homepage, the screen showed “ResizeObserver loop completed with undelivered notifications.” Reload recovered the page. | Reproduce during orientation/viewport changes and isolate the observer/widget interaction. Confirm a production build separately; the observed overlay is development-specific and its exact origin was not established. |

P1 = fix before customer use. P2 = significant usability/quality issue. P3 below = refinement.

## Layout, spacing, and responsive behavior

### Confirmed layout issues

1. **Contact hero has no horizontal gutter on phone/tablet (P2).** Its heading starts at x=0 at 320, 390, and 768 px. The supporting paragraph also touches the edge. Use the same 20–24 px phone gutter as the other pages, with a shared desktop container.
2. **About leadership heading has the same edge-alignment problem (P2).** The breadcrumb and “Leadership” title sit against the left edge at phone and tablet widths. The main company introduction uses a different inset directly below it.
3. **The homepage trust section starts with excessive empty space (P2).** It has 208 px top padding on mobile and 240 px on desktop, following an already full-height hero. Reduce to roughly 48–64 px mobile / 80–96 px desktop unless a deliberate visible element occupies that space.
4. **The homepage is long before customers reach practical service links (P2).** At 1440 px, the core-capabilities section measured about 1,653 px tall and Quick Service Access began around page y=4,180. Six stacked capability cards make desktop scanning unnecessarily slow. Use a compact grid or shorten this section and move service access earlier.
5. **Tablet library header is cramped (P2).** At 768 px, the fixed 320 px search box alongside the title extends into the card's intended right padding; the long title is compressed into a narrow column. Stack title and search until a larger breakpoint, or make both flexible.
6. **Map popovers can be clipped on small phones (P2).** At 320 px, the Kerala popup's text box begins around x=-102; Chennai extends beyond the right edge. Their parent section hides overflow. These are normally hover-hidden, so page-wide overflow checks do not detect the usability failure. Use an anchored, viewport-contained panel or branch list.
7. **Review headings repeat (P3).** “What Our Clients Say” is immediately followed by the widget's “What Our Customers Say.” Keep a single heading and align the widget styling with the page.

### Responsive check results

| Width | Result |
|---|---|
| 320 px | No page-wide overflow in route smoke checks. Contact/About gutters and map interaction need correction. Small text and dense tracking placeholder need attention. |
| 390 px | Main cards and forms stack. Contact title touches edge; quote action is hidden in menu. |
| 768 px | Navigation switches to menu. Contact/About edge alignment persists; customs library header becomes cramped. |
| 1024 px | Desktop navigation appears and page widths fit. About's large headline wraps to five lines in its half-width column. |
| 1440 px | Main page width and header fit. Excess homepage vertical space and long stacked capability cards dominate. |

No broken loaded local images were detected in the smoke checks. These results do not guarantee that all dynamic content, overlays, long text, or real tracking records fit.

### Suggested spacing system

| Element | Phone | Desktop |
|---|---|---|
| Page gutter | 20–24 px, consistently | Shared centered container, about 1152–1200 px maximum |
| Section padding | 48–64 px vertically | 80–96 px vertically |
| Card padding | 20–24 px | 24–32 px |
| Card/grid gap | 16–24 px | 24–32 px |
| Heading to paragraph | 12–16 px | 16–24 px |
| Paragraph to action | 24 px | 24–32 px |
| Main control height | 44–48 px target | 44–48 px target |

Treat these as design targets, not a claim that every current value is wrong.

## Typography, contrast, and accessibility

- **Keep the dark green:** against white, its calculated contrast is approximately 7.97:1.
- **Darken muted text:** `#9ca3af` on white is approximately 2.54:1. It is used for small labels and part of the homepage trust heading. This is too faint for important reading.
- **Darken amber text on light surfaces:** `#d4890f` on white is approximately 2.84:1. Use amber mainly for fills/accents, with a darker text color for small labels and links. These ratios are solid-color calculations; translucent/animated surfaces need separate measurement.
- Body copy is generally 14–18 px. Several important card descriptions use 14 px and document titles use 12–13 px. Prefer 16 px for main reading and 14 px for secondary details.
- Desktop homepage H1 is 72 px; phone H1 is 36 px. The size itself is reasonable, but the all-caps generic sentence takes four lines on a phone. A shorter, specific headline would improve scanning.
- Use approximately 32–40 px phone H1, 48–64 px desktop H1, 28–32 px phone section headings, 36–48 px desktop section headings, and 18–22 px card headings. Keep comfortable line height rather than simply enlarging everything.
- The code loads General Sans, Sora, and Titillium Web. General Sans is the first heading font; Sora mostly acts as a fallback. Simplify to a deliberate heading/body pair to reduce font downloads and unexpected fallback differences.
- The animated homepage title is exposed as separated characters in the accessibility tree. Provide one clean accessible heading string and hide purely decorative split-character spans.
- The site has no reduced-motion implementation found in the inspected source, despite WebGL animation, repeated reveals, marquees, pulsing pins, and animated text. Honor reduced-motion preferences and avoid re-hiding content on every scroll.
- Preserve a standard pointer by default. The custom cursor hides the native cursor even over inputs, reducing familiar text-editing cues.
- Add a skip-to-content link, clear focus indicators, named social links, and logical heading order. About starts with H2/H3 before H1; Services jumps from H2 to H4.
- The map markers are about 14 × 14 px, the menu button about 38 × 38 px, and social circles 36 × 36 px. Enlarge effective hit areas toward 44 × 44 px, especially on touch devices.
- Replace the moving fraud-warning ticker with a short, readable static notice, or provide a pause option. Avoid exposing repeated marquee text twice to assistive technology.

## Images and performance

| Asset | Current file size | Assessment |
|---|---:|---|
| CEO photograph | ~1.9 MB | Displayed at only about 128–144 px. Serve an appropriately sized WebP/AVIF version. |
| Office image | ~1.4 MB | Resize and compress; use responsive sources and check crops at each breakpoint. |
| Repeating background texture | ~1.3 MB | Disproportionately heavy for a low-opacity decoration. Reduce dimensions, simplify, or remove. |
| Logo PNG | ~150 KB | Prefer a clean vector if available, or an optimized raster at the required resolution. |
| India map | ~17 KB, 360 × 400 intrinsic | Efficient file, but enlarged on desktop; a vector would keep boundaries crisp. Preserve the correct aspect ratio. |

The first three assets total roughly 4.6 MB on disk before considering delivery compression, caching, or other assets. This is an optimization signal, not a measured network transfer or load-time score.

- Add actual fleet, warehouse, staff, packing, and delivery photography to the homepage. The current opening is dominated by an abstract animated background and does little to show operational capability.
- Use a coherent photo treatment and intentional crops. Keep faces and vehicles recognizable on phones. Improve the CEO alt text to include the person's name rather than only “CEO.”
- Add responsive image sources, explicit dimensions/aspect ratios, and lazy loading for below-the-fold photographs. These attributes were not found in the inspected image markup.
- The full-screen WebGL background renders continuously. Measure it on a mid-range phone; offer a static fallback and pause unnecessary motion when hidden.
- Repeated blur/backdrop effects plus animation may increase rendering work. Reduce them where they do not support hierarchy.
- Run production performance measurements after changes. No Lighthouse/Core Web Vitals pass or mobile frame-rate claim is made by this review.

## Logistics content, trust, and conversion

1. **Use a more specific opening message.** Explain what can be shipped, coverage, and the benefit. A practical structure is a short courier/cargo headline, Chennai + India coverage subheading, Quote/Pickup CTA, and a distinct Tracking tool.
2. **Reconcile addresses.** Contact's Corporate Office lists “#1, Pallavan St,” while the Chennai Head Office card and structured data use “Plot No. 65, Annai Therasa Street.” If these are separate offices, label their roles clearly; otherwise correct the mismatch.
3. **Reconcile experience claims.** About says founded in 2019 / 7+ years, Home says “a decade,” and Services says “decades.” If the latter refers to combined team experience, explicitly say so.
4. **Reconcile rating claims.** The static homepage statistic is 4.5/5; the loaded Google widget showed 4.7 from 28 reviews during this session. Use a consistent source/date or remove the stale number.
5. **Align the service catalogue.** Ocean Freight appears in the footer, page metadata, and inquiry options, but its service card is commented out. Restore a real explanation or stop advertising it in those locations.
6. **Link to the promised destination.** All footer service links go to the general Services page. Deep-link Air Freight, Customs Forms, and Warehousing to their relevant sections. Apply the same principle to homepage shortcuts.
7. **Validate strong operational claims with the business.** Examples include IATA-certified handling, AEO accreditation, fully insured shipments, IoT/ERP integration, and 24/7 support. Do not change facts without verification; publish accurate, specific evidence where available.
8. **Clarify 24/7 support versus office hours.** State which channel is staffed outside the published Mon–Sat 10:00–19:30 IST hours.
9. **Improve quote intake.** Add origin, destination, weight/volume, shipment type, and preferred pickup date if needed for pricing. Keep the first step short; mark required/optional fields and provide a response-time expectation before submission.
10. **Add a clear data-use explanation near the inquiry form.** Customers should understand how their contact and shipment details will be used, with a relevant privacy link.
11. **Improve document discovery.** Search for KYC correctly reduced 22 forms to one; all 22 referenced local files exist. Add format, purpose, last-reviewed date, and brief guidance. File presence was checked; document contents and regulatory currency were not reviewed.
12. **Edit copy for clarity.** Correct “Head Quaters” to “Headquarters,” use “Customs Forms,” and repair missing punctuation in phrases such as “cargo real infrastructure” and “client assets location, condition, and custody.” Replace vague slogans with concrete service information.

## What already works

- Consistent green/amber branding and recognizable logo treatment.
- Clear five-page navigation with desktop active-state styling.
- Main grids/forms generally stack at smaller widths.
- Pincode lookup for 600075 successfully returned service in Pammal, Kanchipuram, Tamil Nadu, with a call-to-book action.
- Contact error state retains entered data and offers a phone fallback.
- Service-library filtering updates the count and matching link.
- The Google reviews widget eventually loaded real review content.
- Per-page titles, descriptions, canonical metadata, and descriptive image alternatives are present for the main local imagery, with the CEO alt needing improvement.

## Recommended delivery order

1. Fix inquiry delivery, distinguish serviceability errors, improve tracking errors, and verify actual customer flows.
2. Fix form names, semantic links/buttons, overlay focus behavior, and keyboard navigation.
3. Apply shared gutters/spacing; correct phone/tablet layouts and map behavior.
4. Simplify the hero, expose mobile quote/pickup actions, shorten the homepage, and improve service destinations.
5. Optimize images/fonts and motion; reconcile business details and edit copy.
6. Retest in a production build on real iOS/Android devices, keyboard-only navigation, 200% zoom, reduced motion, slow networks, and valid shipment states.

## Implementation references

- Inquiry delivery and missing form label associations: `src/Pages/contactus.js`.
- Homepage search precedence, pincode error handling, scroll interception, section padding, shortcut divs, and static metrics: `src/Pages/home.js`.
- Tracking error presentation and search button naming: `src/Pages/tracking.js`.
- Missing About gutters and heading order: `src/Pages/aboutus.js`.
- Service catalogue and tablet documentation header: `src/Pages/services.js`.
- Map target sizes, hover-only behavior, and popup placement: `src/Components/branchsection.js`.
- Mobile menu behavior: `src/Components/header.js`.
- Contact links, social names, and generic service destinations: `src/Components/footer.js`.
- Continuous animation and cursor: `src/Components/ShaderBackground.js`, `src/Components/ui/CursorFollower.js`, `src/lib/motion.js`, and `src/index.css`.
- Font loading and static contact metadata: `public/index.html` and `tailwind.config.js`.
