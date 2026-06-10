# Project Structure

This repository is organized as a small full-stack monorepo.

```text
apps/
  api/
    config/       environment access
    middleware/   reusable Express middleware
    models/       Mongoose models
    routes/       HTTP route modules
    index.js      API entry point

  web/
    src/
      app/         app composition and routes
      components/ shared UI primitives
      config/     browser environment config
      features/   domain modules
      lib/        reusable client libraries
      utils/      shared utilities
```

## Frontend Feature Modules

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

  friends/
    api/
    components/
    types/
```

Feature modules own their domain-specific API calls, components, and types. Shared UI stays under `components/ui`, and app routes compose feature modules without owning API details.
