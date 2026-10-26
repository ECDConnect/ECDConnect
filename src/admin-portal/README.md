# Admin Portal

Built with [Vite](https://vite.dev/). Run these from the repository root so the
shared tooling in the root `node_modules` is on the path:

- `yarn portal` starts the dev server on http://localhost:3003
- `yarn build:portalonly` type-checks and builds into `build/`
- `yarn test:portal` runs the tests with Vitest

Configuration is read from `.env.local` (see `.env.sample`). Variables keep
their `REACT_APP_` prefix and are read in code with `import.meta.env`.
