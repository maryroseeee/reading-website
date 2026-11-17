# Deployment

The [live application](https://reading-website-nine.vercel.app) uses a Vercel frontend and a Render API backed by MongoDB. See [local development](development.md) for dependency installation and environment setup.

## Application configuration

The following settings match the scripts and directory layout in this repository:

| Setting | Vercel frontend | Render API |
| --- | --- | --- |
| Root directory | `apps/web` | `apps/api` |
| Install/build | `npm ci`, then `npm run build` | `npm ci` |
| Output/start | Publish `dist` | `npm start` |
| Runtime | Node.js 22.12 or newer within Node 22 | Node.js 22 |

The frontend build runs TypeScript checks and Vite. The API starts with `node index.js`, connects to MongoDB using `MONGO_URI`, and listens on `PORT` or 4000. It has no compilation step.

Set `VITE_GOOGLE_CLIENT_ID` in the frontend build environment. Configure the Google OAuth web client's authorized JavaScript origin for the deployed frontend, using the same client ID in the API's `GOOGLE_CLIENT_ID`.

Set these API environment variables in Render:

| Variable | Purpose |
| --- | --- |
| `CLIENT_ORIGIN` | `https://reading-website-nine.vercel.app` for the current frontend; use its HTTPS origin without a path or trailing slash |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID matching the frontend |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing and verifying session JWTs |
| `GOOGLE_BOOKS_API_KEY` | Optional Google Books API key |
| `PORT` | Read from the hosting environment when supplied; defaults to 4000 |

The current authentication flow verifies Google ID tokens and does not use `GOOGLE_CLIENT_SECRET`, although that variable appears in the API environment template. Demo login does not require Google authentication, but it does need a working database and JWT secret.

## Production API routing

In production, [the frontend environment configuration](../apps/web/src/config/env.ts) always sets the API base URL to `/api`. `VITE_API_URL` only overrides that value during local development. An older absolute API URL configured in Vercel therefore does not change production requests.

[apps/web/vercel.json](../apps/web/vercel.json) defines two rewrites, in order:

1. `/api/:path*` forwards to `https://reading-website.onrender.com/api/:path*`.
2. All remaining paths fall back to `/index.html` for React Router navigation and direct page loads.

The API rewrite must come before the React fallback. Otherwise, an API request can receive the frontend HTML document instead of an API response. If the Render service address changes, update the first rewrite's destination.

## Authentication cookies and origins

The [Axios client](../apps/web/src/lib/api-client.ts) sends requests with cookie credentials. The [authentication routes](../apps/api/routes/auth.js) set the `rc_token` JWT cookie with `httpOnly: true`. Cookie options depend on `CLIENT_ORIGIN`:

- HTTPS origins use `secure: true` and `sameSite: 'none'`.
- Local HTTP origins use `secure: false` and `sameSite: 'lax'`.

Keep Render's `CLIENT_ORIGIN` set to the HTTPS frontend origin so deployed authentication cookies remain secure. The API also uses that value as its credentialed CORS origin.

Forwarding `/api` through Vercel keeps browser requests and the authentication cookie on the website's origin. This supports session retention in Safari without relying on direct requests to a separate Render origin.

## Production previews outside Vercel

A production build still calls `/api` when served outside Vercel. The Vite configuration does not include an API proxy, and `vite preview` does not apply Vercel's rewrite configuration.

To serve a local production preview:

```bash
npm run build
npm run preview --prefix apps/web
```

Provide a reverse proxy for `/api` to a running Express API and configure the matching frontend origin and cookie settings. Any other production host also needs the API proxy before its single-page application fallback; setting `VITE_API_URL` alone will not redirect production requests.

## Recruiter demo lifecycle and cold starts

[The demo service](../apps/api/services/demo-data.js) creates separate reader and friend profiles and book records for each session. Book edits are allowed in that temporary account; middleware blocks friendship changes. Logout deletes the session's users and books. Abandoned records are marked with a 24-hour expiry and removed when a later demo session starts; cleanup is not a scheduled job or a MongoDB TTL index.

Render's free API instance can spin down after inactivity, so the initial login request may take about a minute to finish. The login screen displays a wake-up note during a longer request. See [Render's free-instance documentation](https://render.com/docs/free#spinning-down-on-idle) for the hosting behavior.

For deployment verification, confirm that API requests receive JSON rather than the React fallback, demo login reaches the dashboard, authenticated navigation retains the session, and logout ends the demo. Automated CI uses mocked dependencies and does not perform these deployed-service checks.
