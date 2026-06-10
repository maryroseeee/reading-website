# Reading Website

Full-stack social reading tracker with Google OAuth, Google Books search, reading analytics, friends, and profile customization.

## Structure

```text
apps/
  api/    Express, MongoDB, auth, books, and friends API
  web/    React, Vite, Tailwind, and feature-based frontend
```

The web app follows a Bulletproof React-style structure:

```text
apps/web/src/
  app/         routes and app composition
  components/ shared UI primitives
  config/     client environment config
  features/   auth, books, and friends modules
  lib/        reusable app libraries
  utils/      shared utilities
```

## Setup

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
npm install
npm install --prefix apps/web
npm install --prefix apps/api
```

## Development

```bash
npm run dev
```

Web: `http://localhost:5173`

API: `http://localhost:4000`

## Checks

```bash
npm run check
```
