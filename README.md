# Smart E-commerce Platform — Deployment Guide

This repository contains a MERN e-commerce app. The project has been updated for production deployment (frontend → Vercel, backend → Render, DB → MongoDB Atlas). Changes focused on deployment configuration only; no business logic was removed.

## Frontend (Vercel)
- Project path: `frontend`
- Build command: `npm run build` (or `yarn build`)
- Output directory: `dist`
- Add the following environment variables in Vercel project settings:
  - `VITE_API_URL` — e.g. `https://your-backend.onrender.com/api`
  - `VITE_RAZORPAY_KEY_ID` — optional (use test key during staging)
- `vercel.json` has a rewrite to serve `index.html` for SPA routing.

Deploy steps:
1. Push branch to GitHub.
2. Create a Vercel project and point it to the `frontend` folder.
3. Set the environment variables above in Vercel.
4. Deploy — once built, the SPA will be available at your Vercel URL.

## Backend (Render)
- Project path: `backend`
- Start command: `node server.js` (or add a Procfile)
- Add environment variables in Render service settings (see list below).

Deploy steps:
1. Push backend to GitHub.
2. Create a new Web Service on Render and connect the repo (select `backend` folder).
3. Set environment variables (see list) and deploy.

## MongoDB Atlas
1. Create a free cluster on MongoDB Atlas.
2. Create a database user and whitelist Render/Vercel IPs if needed (or allow access from anywhere for quick testing).
3. Obtain the connection string and set `MONGO_URI` in Render environment variables.

## Required Environment Variables
Add these to your Render (backend) environment and to Vercel (frontend) where applicable:

- `MONGO_URI` — MongoDB Atlas connection string (backend only)
- `JWT_SECRET` — Strong secret for JWT signing (backend only)
- `EMAIL_USER` — SMTP user (Gmail address) (backend only)
- `EMAIL_PASS` — SMTP app password (backend only)
- `RAZORPAY_KEY_ID` — Razorpay test key id (backend only)
- `RAZORPAY_KEY_SECRET` — Razorpay test key secret (backend only)
- `CLIENT_URL` — Frontend URL (Vercel domain), used in emails and CORS (backend only)
- `VITE_API_URL` — Full backend API base (frontend only), e.g. `https://your-backend.onrender.com/api`
- `VITE_RAZORPAY_KEY_ID` — Razorpay key for client-side checkout (frontend only, test key)

Notes:
- Never commit `.env` files — `.gitignore` is configured.
- Backend `.env` file was removed; provide secrets via Render environment variables.

## Razorpay (Test Mode)
- This project keeps Razorpay in TEST MODE. Do NOT set live credentials here.
- To test payments:
  1. Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` on Render (test keys).
  2. Set `VITE_RAZORPAY_KEY_ID` in Vercel (frontend) to the same test key id.
  3. On the frontend, place an order via Checkout — Razorpay's test checkout will open.
  4. Use Razorpay test card data (from Razorpay docs) to simulate payments.

## Post-deploy Validation
- Ensure the backend `CLIENT_URL` matches the Vercel frontend URL (for CORS and email links).
- Verify OTP emails by checking SMTP logs (or use a real SMTP account).
- Confirm Razorpay order creation (`/api/payment/order`) returns an order id and frontend opens checkout.

## What was changed (high level)
- Replaced hardcoded `http://localhost:5000/api` calls in frontend with `VITE_API_URL` and a central `frontend/src/utils/api.js`.
- Added `.gitignore` entries and removed `backend/.env` from the repo.
- Hardened CORS in `backend/server.js` to use `CLIENT_URL` env and removed unsafe dev/test routes.
- Improved server and payment error handling and replaced local links inside email templates with `CLIENT_URL`.
- Added `frontend/vercel.json` for SPA routing.

If you want, I can now:
- Add Render and Vercel specific deployment scripts (Procfile, render.yaml)
- Run a local build/test or prepare GitHub Actions for CI/CD
