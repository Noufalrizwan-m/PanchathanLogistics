# Direct Gmail enquiry setup

The website sends enquiry details through its Node.js backend to both sales.panchathanlogistics@gmail.com and info@panchathanlogistics.com. Customer email is Reply-To. The UI stays unchanged.

## Activate locally

1. Sign in to sales.panchathanlogistics@gmail.com in Google Account settings.
2. Enable 2-Step Verification, then create an App Password named Panchathan Website. Availability can depend on account policy.
3. Enter the App Password privately in `.env.local` as `GMAIL_APP_PASSWORD`. Use the app password, not your normal Google password. `GMAIL_USER` is already configured.
4. Restart `npm run start:api`. Keep the frontend and API running together.

Google instructions: https://support.google.com/accounts/answer/185833
App Password page: https://myaccount.google.com/apppasswords

## Production

Run the API on Node.js hosting that permits outbound SMTP over TLS to smtp.gmail.com:465. Put GMAIL_USER, GMAIL_APP_PASSWORD and INQUIRY_ALLOWED_ORIGINS in server environment settings. The frontend calls /api/inquiry; use the same-origin route/proxy or set REACT_APP_INQUIRY_ENDPOINT and the appropriate origin policy. A static-only host cannot execute the Node.js backend.

No Resend key or domain verification is used. Gmail authenticates the sender; both business addresses remain fixed recipients. Form validation, honeypot, rate limits and honest error responses remain enabled. SMTP acceptance is not a guarantee of inbox placement.

Retries are deduplicated for 24 hours within one running API process, including simultaneous requests. Restarting the process or multiple instances requires shared storage to preserve that guarantee. Partial SMTP acceptance is treated as an error; retrying after a partial result may duplicate the message at the inbox that accepted it.

## Current activation status

The Gmail App Password is saved privately in the ignored local environment file. Gmail SMTP connection and authentication have been verified, and the local API was restarted with delivery configured. No real message has been sent and inbox delivery has not yet been verified. Production hosting still requires its own server environment configuration.
