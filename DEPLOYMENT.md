Deployment Guide — Frontend (Vercel) / Backend (Render) / MongoDB Atlas

Overview
- Frontend: Vercel
- Backend: Render (Node service)
- Database: MongoDB Atlas

1) MongoDB Atlas (setup)
- Create a free cluster on MongoDB Atlas.
- Create a database user and whitelist your IP or enable access from anywhere (0.0.0.0/0) for testing.
- Copy the connection string and replace <password> and <dbname>.
- Set `MONGO_URI` in Render environment variables to the connection string.

2) Backend — Render deployment
- Create a new Web Service on Render.
- Connect your GitHub repo or push the project.
- Build & Start commands:
  - Build command: (not required for pure Node) leave blank
  - Start command: `node backend/server.js` or set `npm start` if configured.
- Environment variables (in Render service settings):
  - `MONGO_URI` = your Atlas URI
  - `PORT` = 5000 (Render will override with its assigned port via `PORT` env automatically)
  - `CLIENT_URL` = https://<your-vercel-app>.vercel.app
  - `RAZORPAY_KEY_ID` = (OPTIONAL) rzp_test_xxx  — must be test key; do NOT use live keys
  - `RAZORPAY_KEY_SECRET` = (OPTIONAL)
  - `EMAIL_USER` = (OPTIONAL) for OTP/email features
  - `EMAIL_PASS` = (OPTIONAL)
- Notes:
  - The backend will refuse to create orders if Razorpay keys are missing or are live keys.
  - The server listens on `process.env.PORT || 5000` so Render-provided `PORT` will be used.

3) Frontend — Vercel deployment
- Create a new Vercel project pointing to your frontend folder.
- Set Environment Variables in Vercel dashboard (Project Settings → Environment Variables):
  - `VITE_API_URL` = https://<your-backend-service>.onrender.com
  - `VITE_RAZORPAY_KEY_ID` = rzp_test_xxx (optional; omitting disables checkout)
- Build command: `npm run build` (or `yarn build`)
- Output directory: `dist`
- Notes:
  - The frontend uses `VITE_API_URL` at build time. If unset, it falls back to relative `/api`.
  - Checkout will be disabled in the UI if `VITE_RAZORPAY_KEY_ID` is missing or not a test key.

4) Local Development
- Create `.env` files in backend and frontend based on `.env.example`.
- Backend: run `cd backend && npm install && npm run dev` (requires `nodemon` for dev)
- Frontend: run `cd frontend && npm install && npm run dev`

5) Security & Notes
- NEVER put live Razorpay keys in environment variables for this repo when deploying — the app enforces test-only keys.
- If you want to enable email in production, use an app password (Gmail) or a transactional email provider.
- Keep `MONGO_URI` secret and restrict Atlas IP access where possible.

6) Troubleshooting
- Backend exits at startup only if `MONGO_URI` is missing because the app requires a DB.
- Razorpay: if order creation returns 503 with message `Payment service not configured`, set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (test keys only).
- Email: if email credentials are missing, OTPs are logged to the server console instead of being sent.

7) Quick env summary (Render / Vercel)
- Required for production: `MONGO_URI`, `CLIENT_URL`, `VITE_API_URL`
- Optional: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `EMAIL_USER`, `EMAIL_PASS`

That's it — follow these steps to deploy frontend on Vercel, backend on Render, and use MongoDB Atlas as the database.
