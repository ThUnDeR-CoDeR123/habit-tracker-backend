# Habit Tracker Backend

A simple Node.js + TypeScript backend for a habit-tracking application using Express, Prisma (PostgreSQL), and JWT-based authentication.

**Repository layout**

- `src/` - TypeScript source files
  - `config/` - database connection
  - `controller/` - Express controllers
  - `routes/` - route definitions
  - `middleware/` - auth & rate limiting
  - `utils/` - helper utilities
  - `tests/` - Jest test suites
- `prisma/` - Prisma schema
- `jest.config.js`, `tsconfig.json`, `package.json`

## Quick Start (Development)

Prerequisites:
- Node.js 18+ (or current LTS)
- PostgreSQL running and accessible
- `npm` available

1. Install dependencies

```powershell
cd D:\nodejs\habit-tracker-backend
npm install
```

2. Environment variables

Create a `.env` file in the project root (or set the env vars in your environment). Minimum required variables:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret_here
PORT=3000
NODE_ENV=development
```

3. Prisma setup

Generate Prisma client and run migrations (if you have migrations to apply):

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

If you just want to introspect an existing DB schema, use `npx prisma db pull` instead.

4. Run the app

```powershell
npm run build    # if using a build step (check package.json)
npm start        # or `npm run dev` if a dev script exists
```

In development the server listens on `PORT` (default: 3000).

## Running Tests

This repo uses Jest + ts-jest. The tests interact with the database, so ensure `DATABASE_URL` in `.env` points to a test or local database.

```powershell
npm test
```

Notes from the test setup in this repo:
- Tests are configured to run sequentially (`maxWorkers: 1`) to avoid Prisma connection conflicts.
- Tests perform some cleanup of a test user (`test@example.com`). If you change that address, update tests accordingly.

## Important Environment Notes

- Use a dedicated database/schema for tests to avoid accidental data loss.
- `JWT_SECRET` should be set in production; a development default may exist in code.

## Development Notes

- Server exports the Express `app` and there is a top-level server listener in `src/server.ts`.
- Tests use `supertest` and connect to the running app instance.
- Prisma client is instantiated at `src/config/database.ts` and should be disconnected when tests complete to avoid open-handle warnings.

## Contributing

- Fork the repository and open pull requests for changes.
- Run the test suite before submitting a PR.

## Useful Commands

```powershell
# Install deps
npm install

# Generate Prisma client
npx prisma generate

# Run DB migrations (development)
npx prisma migrate dev --name <migration-name>

# Run tests
npm test

# Run in development (example)
npm run dev
```

## License

This project does not include a license in the repository by default. Add a license file (e.g., `LICENSE`) if you intend to open-source it.

---

If you want, I can also:
- Add a `README` section documenting the test user email and how the tests manage cleanup,
- Add a minimal `.env.example` to the repo,
- Or update/confirm the `package.json` scripts for `dev`, `start`, and `build`.

Which of those (if any) would you like me to add now?