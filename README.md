# Reading Website

A full-stack social reading tracker for logging books, tracking yearly reading stats, organizing shelves, and comparing progress with friends.

This project was built as a practical reading competition app: users can sign in with Google, search Google Books, add custom editions, manage books across reading shelves, track current reading progress, customize their profile/theme, and view friends' reading activity with polished loading and error states.

## Highlights

- Google OAuth authentication with protected app routes
- Google Books search with flexible matching and manual "add your own version" fallback
- Three-shelf book workflow: read books, currently reading, and want to read
- Completion date tracking, points calculation, page progress, and reading charts with clear totals
- Search, sorting, pagination, and add-book actions on shelf pages
- Friend requests, friend profiles, friend reading shelves, and comparison charts
- Friend shelf filtering/search with quick actions to add a friend's book to your own shelves
- Hover and dropdown actions for changing shelves, editing editions, setting read dates, and deleting books
- Per-user theme colors, including pink, blue, navy, black, and other light/dark-friendly options
- Skeleton loading states and retryable error screens across data-heavy pages
- Recruiter demo login that opens a populated temporary account without requiring Google sign-in
- Responsive React UI with reusable feature components and neobrutalist styling
- Full-stack monorepo structure with a React/Vite frontend and Express/MongoDB API

## Recruiter Demo

The deployed site includes a **View Recruiter Demo** button on the login page. It signs visitors into a seeded temporary profile with books, reading progress, a demo friend, friend shelves, and comparison data already populated. Recruiters can try edits and hover actions during the session; the temporary demo copy is deleted on logout.

## Screenshots

Screenshots for the main user flows are stored in `docs/screenshots`.

### Login

![Login page](docs/screenshots/Login.png)

### Dashboard

![Dashboard overview](docs/screenshots/Dashboard.png)

### Book Shelves

![Read books shelf](docs/screenshots/Read.png)

![Want to read shelf](docs/screenshots/Want%20To%20Read.png)

### Friends Page and Compare

![Friends page](docs/screenshots/Friends.png)

![Chart comparison](docs/screenshots/chart%20comparison.png)

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI primitives
- Google OAuth client
- Axios

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT auth with HTTP-only cookies
- Google Auth Library
- Google Books API

**Tooling**

- ESLint
- TypeScript project build
- Concurrent frontend/API development scripts
- Root-level verification command for frontend and backend checks

## Core Features

### Books and Shelves

Users can search for books, choose an edition, upload/customize cover data, and place each book onto a shelf from the dashboard, search page, or shelf pages:

- **Read Books**: requires a completion date and contributes to yearly stats.
- **Currently Reading**: tracks current page and displays a progress bar.
- **Want To Read**: keeps future reads separate from completed books.

Books can be moved between shelves later. Existing shelf actions are disabled so users cannot accidentally re-add a book to the same shelf, and moving a book to Read requires an explicit completion date.

Shelf pages include:

- search across title, author, genre/category, and page count
- sorting by date added to shelf, date read, title, author, pages, and points
- pagination for larger collections
- dropdown edit controls for changing shelves, changing editions, editing read dates, and deleting books
- consistent book card sizing with preserved title/author details

Dashboard book hovers also support quick shelf changes, edition edits, and deletion without leaving the page.

### Reading Analytics

The dashboard includes charts and totals for yearly reading activity:

- books read
- pages read
- points earned
- author and genre/category summaries

The scoring model is calculated from page count and stored with each saved book.

### Social Reading

Users can:

- set a unique username before sending friend requests
- search for other users
- send, accept, or reject friend requests
- view a friend's profile and shelves
- search and sort friend shelf views
- add a friend's book to their own shelves
- compare reading stats against a friend

Friend profile pages use the friend's theme color so the viewed profile feels like that user's space.

### Personalization

Users can update their display name, username, bio, avatar, and app theme color. Theme settings persist per signed-in user, so different accounts can keep different color preferences.

The app includes a custom login screen with a fixed orange theme, grid background, and classic-book preview content. App themes include light and dark-friendly color handling, including navy and black themes with adjusted foreground text for readable cards and buttons.

### User Experience and Reliability

The app includes visible async states and guardrails for common failure paths:

- skeleton placeholders while dashboards, shelves, profiles, comparison charts, and search data load
- retryable error states when required page data fails
- protected route session checks before signed-in pages render
- disabled friend request actions until the user sets a username
- Google Books fallback flow when search is unavailable or a result is missing
- manual custom-book creation when API results are incomplete

## Architecture

This repository is organized as a small full-stack monorepo.

```text
apps/
  api/    Express API, MongoDB models, auth middleware, route modules
  web/    React app, feature modules, shared UI, app routes
docs/     project structure notes
```

The frontend follows a feature-oriented structure inspired by Bulletproof React:

```text
apps/web/src/
  app/          app composition and route pages
  components/   shared UI primitives
  config/       browser environment config
  features/     auth, books, and friends domain modules
  lib/          reusable client libraries
  utils/        shared utilities
```

Feature modules own their domain-specific API calls, components, types, and utilities:

```text
features/
  auth/
    api/
    components/
    types/

  books/
    api/
    components/
    types/
    utils/

  friends/
    api/
    components/
    types/
    utils/
```

This keeps app routes focused on composition while reusable behavior lives with the feature that owns it.

## API Overview

The Express API exposes route modules for:

- `auth`: Google sign-in, current user session, profile updates, theme updates
- `books`: saved books, Google Books search, shelf updates, deletion
- `friends`: friend search, requests, friend lists, friend books, social comparison data

Authentication is handled through middleware that verifies the signed-in user before protected book and friend operations.

## Available Scripts

```bash
npm run dev       # Start API and web app together
npm run dev:web   # Start only the Vite frontend
npm run dev:api   # Start only the Express API
npm run build     # Build the frontend
npm run lint      # Lint the frontend
npm run test      # Run frontend component tests and API tests
npm run check     # Run lint, tests, build, and backend syntax checks
```

## Verification

The main project verification command is:

```bash
npm run check
```

It runs the frontend lint/build pipeline, automated tests, and syntax-checks the backend route, middleware, and config files.

## What This Project Demonstrates

- Building a full-stack authenticated application from end to end
- Designing domain-based frontend architecture instead of placing all logic in routes
- Integrating third-party APIs while handling imperfect search results and fallback workflows
- Modeling social features with backend validation and user-facing UI states
- Implementing loading, error, empty, and fallback states for async workflows
- Managing protected routes, persisted user settings, and authenticated API calls
- Creating a polished, iterative UI with reusable components and responsive layouts
- Maintaining a monorepo with root-level scripts and a clear verification path
- Adding automated frontend component tests and backend API route tests
