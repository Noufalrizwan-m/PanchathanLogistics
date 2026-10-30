# Panchathan Logistics website

The public website for Panchathan Logistics, a Chennai-based logistics and IT asset management company. It provides information about services and locations, shipment tracking, pincode lookup, customs forms, customer reviews, and an enquiry form.

The website is a React application. Enquiries use a separate Node.js email service; shipment tracking and pincode lookups use existing PHP endpoints hosted outside this repository.

## Website pages

| Page | Path | Purpose |
| --- | --- | --- |
| Home | `/` | Company introduction, shipment and pincode search, capabilities, branches, and customer reviews |
| Services | `/services` | Logistics services, delivery process, and searchable customs documents |
| About us | `/about` | Company information, history, values, and leadership |
| Contact us | `/contact` | Enquiry form, office information, and regional hubs |
| Tracking | `/tracking` | AWB lookup, shipment progress, and proof of delivery when available |
| Enquiry privacy | `/privacy` | Short notice about information submitted through enquiries |

The React application also has a page-not-found screen. Whether an unknown URL returns an HTTP 404 depends on the hosting server configuration.

## What has been built

- **Responsive layouts:** Compact mobile and tablet sections, swipeable service cards, a shorter regional-hub layout, and desktop layouts tailored to larger screens. Animations use GSAP and Framer Motion, with reduced-motion support.
- **Refresh intro:** A short asset-packing video plays on page load, using a portrait clip for phones and a landscape clip for larger screens. A 1–100 counter, Skip button, and timeout are provided. The page renders behind the video; the counter is an animation, not a measurement of all network downloads.
- **Tracking and pincode search:** AWB fields include the fixed `PL786` prefix, accept the remaining digits, and show helpful validation and error messages. Pincode and tracking requests use the existing logistics API.
- **Enquiries:** Contact details are validated before submission, including email and international phone numbers. The server sends the enquiry to the business inboxes and uses the customer's email as Reply-To. Success and failure states are shown to the visitor.
- **Reviews:** Google reviews are displayed through an Elfsight widget in an isolated frame so widget errors during page changes do not interrupt the main application.
- **Other visitor states:** A page-not-found screen, tracking and enquiry error states, customs-form search with an empty state, and an offline notice while the site is open.
- **SEO:** Route-specific titles, descriptions, canonical URLs, social metadata, and structured data. The build also produces route-specific HTML for six pages, plus a sitemap, robots file, and Google Search Console verification file.

## Technology

- React 19 and React Router, built with Create React App (`react-scripts`)
- Tailwind CSS, GSAP, Framer Motion, and Lucide icons
- Node.js and Nodemailer for the enquiry API
- Existing PHP-based shipment API, maintained separately from this repository
- Elfsight for Google reviews and Google Maps for the contact map

## Requirements

- Node.js and npm. Node.js **24** was used in the local environment; the API start command requires a Node version that supports `--env-file-if-exists`.
- Access to the existing shipment API for live tracking and pincode data.
- For real enquiry emails, a configured Gmail sender, Google App Password, and a Node.js host with outbound SMTP access.

## Run locally

From the project folder:

```bash
npm ci
npm start
```

Open [http://localhost:3000](http://localhost:3000). The frontend can run without email credentials, but enquiry delivery will require the API setup below.

### Set up the enquiry service

1. Create `.env.local` from `.env.example`.
2. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` privately. The password must be a Google App Password, not the account's normal password.
3. In a second terminal, run:

   ```bash
   npm run start:api
   ```

4. Keep both the frontend and API running. The development proxy in `src/setupProxy.js` forwards `/api` requests to `http://127.0.0.1:3001`.

The sender and credentials are configured on the server. The enquiry recipients are currently `info@panchathanlogistics.com` and `sales.panchathanlogistics@gmail.com`, defined in `server/inquiry.js`. See [INQUIRY-SETUP.md](INQUIRY-SETUP.md) for more detail.

| Environment variable | Where it is used | Purpose |
| --- | --- | --- |
| `GMAIL_USER` | Server only | Gmail sender address |
| `GMAIL_APP_PASSWORD` | Server only | Gmail App Password for SMTP authentication |
| `INQUIRY_ALLOWED_ORIGINS` | Server only | Comma-separated website origins allowed to submit enquiries |
| `INQUIRY_PORT` | Standalone server, optional | API port; defaults to `3001` |
| `REACT_APP_INQUIRY_ENDPOINT` | Frontend build, optional | Public enquiry API URL; otherwise the frontend uses `/api/inquiry` |

Never put credentials in a `REACT_APP_` variable: those values are included in the browser bundle. Keep real credentials out of Git and share them with the deployment team through a secure channel.

**Production endpoint:** The checked-in `.env.production` currently sets `REACT_APP_INQUIRY_ENDPOINT` to `https://panchathan-logistics.vercel.app/api/inquiry`. This value is embedded at build time. Confirm that endpoint and its allowed origins with the deployment team; change the configuration and rebuild if the production API moves.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the React development server |
| `npm run start:api` | Start the standalone enquiry API on `127.0.0.1:3001` by default |
| `npm test` | Run the React test runner |
| `npm run test:api` | Run the Node enquiry API tests |
| `npm run build` | Create the production frontend and generate route-specific SEO HTML in `build/` |

## Project structure

```text
src/
  App.js                    Routes, intro, scroll restoration, and global layout
  Pages/                    Home, services, about, contact, and tracking pages
  Components/               Header, footer, forms, video intro, reviews, and UI components
  lib/                      Business data, SEO data, API helpers, validation, and hooks
  setupProxy.js             Local /api proxy to the enquiry server
public/
  asset-packing-*.mp4       Intro videos for landscape and portrait screens
  reviews-widget.html       Isolated Elfsight reviews page
  logo-480.webp             Website logo
  doc/                      Downloadable customs documents
  robots.txt, sitemap.xml   Search crawler configuration
  google*.html              Google Search Console verification file
server/
  index.js                  Standalone Node HTTP server
  inquiry.js                Enquiry validation and Gmail SMTP delivery
  inquiry.test.js           API tests
api/inquiry.js              Serverless entry point for the same enquiry handler
scripts/generate-seo-html.js Route-specific production HTML and SEO metadata
```

## Deployment

1. Install dependencies and run `npm run build`.
2. Upload the **contents** of `build/` to the frontend hosting directory. The build includes images, videos, `reviews-widget.html`, sitemap, robots file, and the Google verification file. Do not upload `node_modules` or private environment files.
3. Configure the host to serve the generated page paths and support React route navigation and refresh. A root `.htaccess` rewrite example exists in the repository; it is not automatically copied into `build/`. Confirm the correct rules with the hosting team and avoid overwriting existing API or PHP routes.
4. Run or deploy the enquiry API separately on a Node.js-capable host, or use the serverless entry point on a compatible platform. Configure the server-side variables and outbound `smtp.gmail.com:465` access. The standalone server listens on `127.0.0.1`, so it needs a reverse proxy when used on a server.
5. Confirm the built frontend points to the intended enquiry endpoint and that its origin is allowed by the API. Test an enquiry and confirm receipt in both inboxes.
6. Test tracking, pincode lookup, proof of delivery, the map, Google reviews, and the intro on mobile and desktop. These integrations depend on external services or device/browser capabilities.

A static or PHP-only server can serve the built frontend, but it **cannot run the current Node.js enquiry service by itself**. Use a separate Node host or implement and test a compatible replacement API. The existing tracking PHP application is not included in this repository.

### Search Console and analytics

`public/google682cb15d511eab34.html` is the Google Search Console HTML verification file. The production build copies it to the site root. Once deployed, check that it is publicly available at `https://panchathanlogistics.com/google682cb15d511eab34.html`, then complete verification in the appropriate Search Console property. Keep the file deployed afterward.

The repository includes `robots.txt` and `sitemap.xml`; submit the sitemap in Search Console after deployment. No Google Analytics measurement ID or tracking tag is currently present in the source. Search Console verification is not the same as Google Analytics, and verification or metadata does not guarantee indexing or rankings.

## Notes for the team

- The current `/privacy` page is a brief **enquiry privacy notice**, not a complete website privacy policy. Broader policy and service terms require the company's actual practices and review.
- The offline message appears if the connection drops while the site is open. It does not make the website or tracking available offline.
- The review widget, map, shipment API, fonts, and SMTP delivery depend on external services. Check them on the deployed domain; local build success alone does not verify live service availability or inbox delivery.
- The enquiry service's rate limiting and duplicate protection use in-memory state. They do not provide shared protection across server instances or persist after restarts.
- The CRA development overlay filters the browser's specific deferred ResizeObserver notification while leaving other errors visible. The message still appears as a console warning; this does not fix a potential third-party resize loop.
