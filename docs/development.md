# Development

See the [project overview and quick start](../README.md#local-setup) for the shortest setup path. Run the commands below from the repository root unless stated otherwise.

## Requirements and dependency installation

Use Node.js 22 LTS, version 22.12 or newer, and npm. The frontend's Vite version requires at least Node 22.12 on the Node 22 release line; CI uses Node 22.

The root, frontend, and API are separate npm projects, each with its own manifest and committed lockfile. Installing at the root does not install application dependencies.

```bash
npm ci
npm ci --prefix apps/web
npm ci --prefix apps/api
```

`npm ci` replaces that project's installed dependencies using its lockfile. Keep all three `package-lock.json` files committed so local installation and CI use the same dependency resolutions.

## Environment configuration

Copy the committed templates for a new checkout:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

Fill in the local files before starting the application. Environment files are ignored by Git. The API loads `apps/api/.env` relative to its configuration module, so root-level scripts use the same file as commands run within `apps/api`.

### Frontend: `apps/web/.env`

| Variable | Local value or purpose |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth web client ID for Google sign-in; use the same ID as the API |
| `VITE_API_URL` | `http://localhost:4000/api`; overrides the API URL only in development |

Only put browser-visible configuration in `VITE_` variables. Restart Vite after changing the environment file.

### API: `apps/api/.env`

| Variable | Local value or purpose |
| --- | --- |
| `CLIENT_ORIGIN` | `http://localhost:5173`; the frontend origin allowed by CORS and used to select cookie options |
| `MONGO_URI` | Connection string for a running local or hosted MongoDB database |
| `JWT_SECRET` | A random secret used to sign and verify session tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth web client ID used to verify Google ID tokens |
| `GOOGLE_BOOKS_API_KEY` | Optional Google Books key; requests omit the key when unset |
| `PORT` | `4000` by default |

The API template also contains `GOOGLE_CLIENT_SECRET`. The current ID-token verification flow does not read this variable or require a client secret.

For local Google sign-in, configure the OAuth client's authorized JavaScript origin as `http://localhost:5173` and use its client ID in both application files. Recruiter demo login bypasses Google sign-in, but still requires MongoDB and `JWT_SECRET`. Google Books search needs network access; manual book entry remains available if search fails.

Use `localhost` consistently for the client and API. If you change the frontend origin or API port, update `CLIENT_ORIGIN` and `VITE_API_URL` to match, along with the Google origin when using Google sign-in.

## Development commands

```bash
npm run dev       # Start API and frontend together
npm run dev:web   # Start only the Vite frontend
npm run dev:api   # Start only the Express API with nodemon
npm start         # Start the API without nodemon
```

The frontend defaults to [http://localhost:5173](http://localhost:5173), and the API to `http://localhost:4000/api`.

## Tests and builds

```bash
npm run lint
npm test
npm run build
npm run check
```

`npm run check` runs frontend lint, both test suites, the TypeScript/Vite frontend build, and syntax checks for the API entry points, routes, middleware, configuration, models, and demo service. The frontend build produces `apps/web/dist`; the API runs directly as JavaScript and has no compilation step.

To focus on one application or watch frontend tests:

```bash
npm test --prefix apps/web
npm test --prefix apps/api
npm run test:watch --prefix apps/web
```

Frontend tests use Vitest, jsdom, and React Testing Library. API tests use Vitest and Supertest against `createApp()`, with mocked Mongoose models, demo services, and Google Books requests. Tests provide a test-only JWT secret; they do not start the API listener or connect to MongoDB. The build and tests need no environment files or repository secrets. Passing verification does not establish that Google authentication, a real database, or deployed services work end to end.

## Dependency and lockfile troubleshooting

- **Missing executables or modules:** run all three clean install commands above. Each application needs its own dependencies.
- **`npm ci` reports a manifest/lockfile mismatch:** for an intentional dependency change, run `npm install` in that package's directory to update its lockfile. Review and commit the manifest and lockfile together, then repeat the clean installs and `npm run check`.
- **React peer dependency conflicts:** the committed frontend lockfile resolves `react-day-picker` 8.10.2, whose React peer range includes React 19. Normal `npm ci` works without bypassing peer dependency checks. Confirm the intended lockfile is checked out before changing dependency resolution or adding installation flags.
- **Node engine errors:** confirm `node --version` reports Node 22.12 or newer on the Node 22 line. Use the same runtime when reproducing CI failures.

## GitHub Actions CI

The [CI workflow](../.github/workflows/ci.yml) runs on pushes to any branch and on pull requests. Its **Lint, test, and build** job runs on Ubuntu, checks out the repository, sets up Node 22, and caches npm downloads using all three lockfiles. It then runs the same three `npm ci` commands and `npm run check` used locally.

After pushing, open the repository's **Actions** tab, select **CI**, and inspect the failing install or verification step if the job fails. Reproduce that command locally with the same Node release and committed lockfiles. A successful local macOS run does not verify the hosted Ubuntu runner or GitHub Actions configuration; confirm the hosted check also passes and appears on pull requests. After a successful hosted run, the check can optionally be required through branch protection.

For frontend previews and deployment-specific login issues, see [deployment and routing](deployment.md).
