# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run the app (production)
npm start         # node src/app.js, defaults to port 80

# Run with auto-reload during development
npm run server    # nodemon src/app.js
```

No lint or test pipeline is configured yet.

## Environment Variables

Create a `.env` file in the project root. Required variables when the backend is implemented:

```
ENV=development
PORT=<your_port>
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
EXPIRY=<jwt_expiry_time>
SECRET=<secret_for_mongostore>
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_KEY=<cloudinary_key>
CLOUDINARY_SECRET=<cloudinary_secret>
X_RAPIDAPI_HOST=<rapidapi_sendgrid_host>
X_RAPIDAPI_KEY=<rapidapi_sendgrid_key>
SENDGRID_EMAIL=<no-reply@your_domain.com>
```

## Architecture

**Stack:** Node.js + Express + EJS templating. Static assets served from `/static`. No frontend build step.

**Entry point:** `src/app.js` — bootstraps Express, loads dotenv, requires db connection, sets up static/view paths, and defines three GET routes.

**Routes (currently GET-only):**
- `/` → `views/index.ejs` (landing page)
- `/signup` → `views/signup.ejs` (signup/login form)
- `/dashboard` → `views/dashboard/dashboard.ejs` (rendered without auth for now)

**Views** use EJS partials under `views/partials/` (landing page sections: nav, hero, feature, achievements, footer) and `views/partials/dashboard/` (sidebar, navbar, task cards).

**Styles** are organized per page/component under `static/styles/` with a `partials/` and `dashboard/` subfolder mirroring the view structure.

**Backend stubs (empty placeholders — not yet implemented):**
- `src/db/conn.js` — MongoDB connection (Mongoose expected)
- `src/models/user.model.js` — User model
- `src/middleware/auth.js` — JWT auth middleware
- `src/routes/login.route.js`, `signup.route.js`, `dashboard.route.js` — route handlers
- `src/cloudinary/index.js` — Cloudinary image upload

When implementing backend features, wire routes into `app.js` via `app.use()` and implement the corresponding stub files. Auth middleware should guard the `/dashboard` route.
