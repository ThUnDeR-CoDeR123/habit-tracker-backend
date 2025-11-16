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

## API Reference

Below are the primary API routes implemented by the backend. All requests and responses use JSON. Replace `:id` with the resource id.

- **POST /api/auth/register** — Register a new user (public)
  - Body: `{ "name": string, "email": string, "password": string }`
  - Success: `201` `{ "success": true, "message": "User registered successfully" }`

- **POST /api/auth/login** — Login and receive a JWT (public)
  - Body: `{ "email": string, "password": string }`
  - Success: `200` `{ "success": true, "token": "<jwt>" }`

- **POST /api/habits** — Create habit (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": string, "description"?: string, "frequency": "daily" | "weekly" }`
  - Success: `201` `{ "success": true, "data": { "id": "<habitId>", ... } }`

- **GET /api/habits** — Get all habits for the authenticated user (protected)
  - Headers: `Authorization: Bearer <token>`
  - Success: `200` `{ "success": true, "data": [ { "id": "<habitId>", ... } ] }`

- **GET /api/habits/:id** — Get habit details (protected)
  - Headers: `Authorization: Bearer <token>`
  - Success: `200` `{ "success": true, "data": { "id": "<habitId>", ... } }`

- **PUT /api/habits/:id** — Update a habit (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: fields to update, e.g. `{ "title": "Updated" }`
  - Success: `200` `{ "success": true, "message": "Updated successfully" }`

- **DELETE /api/habits/:id** — Delete a habit (protected)
  - Headers: `Authorization: Bearer <token>`
  - Success: `200` `{ "success": true, "message": "Habit deleted" }`

- **POST /api/habits/:id/track** — Track completion for today (protected)
  - Headers: `Authorization: Bearer <token>`
  - Success: `201` `{ "success": true, "message": "Tracked" }` (or `409` if already tracked today)

- **GET /api/habits/:id/history** — Get last 7 days history (protected)
  - Headers: `Authorization: Bearer <token>`
  - Success: `200` `{ "success": true, "data": [ { "date": "YYYY-MM-DD", "completed": true|false }, ... ] }`

- **GET /api/habits/:id/streak** — Get streak count (protected)
  - Headers: `Authorization: Bearer <token>`
  - Success: `200` `{ "success": true, "streak": 3 }`

## Example Requests / Responses

Register (curl):

```bash
curl -X POST https://your-host/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Response (201):

```json
{ "success": true, "message": "User registered successfully" }
```

Login (curl):

```bash
curl -X POST https://your-host/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response (200):

```json
{ "success": true, "token": "<JWT_TOKEN>" }
```

Create Habit (example using token):

```bash
curl -X POST https://your-host/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"title":"Morning Run","description":"Run 3km","frequency":"daily"}'
```

Response (201):

```json
{ "success": true, "data": { "id": "abc123", "title": "Morning Run", "frequency": "daily" } }
```

## JWT Usage Instructions

- The API expects a JWT in the `Authorization` header for protected routes using the format:

  `Authorization: Bearer <token>`