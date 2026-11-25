<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# InternSpace

InternSpace is a Vite/React application with an Express API and MySQL persistence.

## Run locally

**Prerequisites:** Node.js and MySQL.

1. Install dependencies with `npm install`.
2. Create a MySQL database and user, then copy `.env.example` to `.env` and set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE`. Keep `FRONTEND_ORIGIN` at `http://localhost:3000` for the default Vite URL.
3. Apply the schema with `npm run migrate`.
4. Configure SMTP in `.env` to send verification and password-reset emails. For Gmail, use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, your Gmail address for `SMTP_USER` and `SMTP_FROM`, and a Google App Password for `SMTP_PASSWORD` (not your regular Gmail password). Keep these values private and restart the API after changing `.env`. Without SMTP in development, verification links are printed in the API terminal and an active account's reset link is shown on the forgot-password page for local testing; reset tokens are never returned this way in production. Google/GitHub OAuth is optional.
5. Start the API with `npm run dev:api` and the frontend with `npm run dev` in separate terminals. Vite proxies `/api` requests to the local API.
6. To provision the first administrator, set `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_NAME`, and `ADMIN_BOOTSTRAP_PASSWORD`, then run `npm run seed:admin`. The command does not create an administrator unless those values are set.

Uploads are limited to 5 MB and stored in `.private_uploads` outside the public web root. Do not expose or commit that directory. Premium payments are manual: the server owns plan prices and activates premium only after an administrator verifies an uploaded payment proof; no payment gateway or bank details are configured.

## Verification

Run `npm run typecheck:api`, `npm run test:api`, and `npm run build` to validate the backend and frontend. The legacy `npm run lint` script typechecks the full repository and currently also requires the separate `@remix-run/react` dependency used by files under `app/routes`.
