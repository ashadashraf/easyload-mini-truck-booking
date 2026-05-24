# EasyLoad Project Notes (For Devs + AI Agents)

This repository contains a minimal logistics booking system for a single mini truck driver (UAE). It is intentionally simple, low-cost, and WhatsApp-first.

## Objective

Customer:
- Submit pickup/drop/time/phone and optional expected price.
- See an estimated fare.
- Contact driver via WhatsApp or phone.
- Track booking status and final price using a private token link (no login).

Driver (admin):
- Must authenticate (Supabase Auth email + password).
- View all bookings.
- Contact customers.
- Set final agreed price and update booking status.

Non-goals:
- No customer accounts, OTP, payments, chat, realtime tracking, or microservices.

## Tech Stack

- Next.js App Router (frontend + API routes)
- Supabase (PostgreSQL + Auth)
- Local UI state (no extra state libraries)

## Key Domain Rules

Pricing types:
- `estimated_price`: system-calculated
- `expected_price`: optional customer input
- `final_price`: set by driver (actual transaction value)

Validation:
- `final_price` is required when status becomes `booked`.
- Status transitions are constrained and backward transitions require confirmation in the UI.

## Booking Lifecycle

Default flow:
1. Customer creates booking (status = `pending`).
2. Customer contacts driver (WhatsApp/call).
3. Driver negotiates externally.
4. Driver sets `final_price`, marks status = `booked`.
5. Driver marks status = `completed`.

Statuses:
- `pending`, `contacted`, `booked`, `completed`, `rejected`

## Architecture Overview

**UI**
- `/` customer booking form + confirmation panel
- `/driver` driver login + driver dashboard
- `/booking/[token]` public booking view (token-only access)

**API**
- `POST /api/bookings` public: create booking + generate `access_token` + return `access_link`
- `GET /api/bookings` protected: driver-only list
- `GET /api/bookings/:id` protected: driver-only get
- `PATCH /api/bookings/:id` protected: driver-only update status/final_price/notes
- `GET /api/bookings/token/:token` public: fetch booking by `access_token`
- `GET /api/estimate` public: local preview estimate (does NOT call Google)
- `POST /api/driver/push-subscriptions` protected: save driver PWA push subscription
- `DELETE /api/driver/push-subscriptions` protected: remove driver PWA push subscription
- `POST /api/driver/push-subscriptions/test` protected: send a driver test notification

**Storage**
- All bookings live in Supabase table `public.bookings` (see `supabase/schema.sql`).
- Driver PWA notification subscriptions live in `public.driver_push_subscriptions`.
- The old `data/bookings.json` file is not used anymore (kept only as a historical artifact/export).

## Authentication Model

### Driver auth (required)

- Supabase Auth email+password.
- Browser signs in using Supabase JS SDK.
- Driver dashboard calls protected API routes with:
  - `Authorization: Bearer <access_token>`

Server-side enforcement:
- API routes call `requireDriver()` in `lib/auth/driver.ts`.
- `requireDriver()` verifies the bearer token using Supabase Auth and optionally restricts to `DRIVER_AUTH_EMAIL`.

### Customer auth (no login)

- When a booking is created, the backend generates a long random `access_token`.
- Customer receives a private link: `/booking/{access_token}`.
- Customer can view status/prices only via this token, never by phone number lookup.

## RLS (Row Level Security)

`public.bookings` has RLS enabled and is *deny-by-default* for direct browser access:
- `anon`: denied
- `authenticated`: denied

All access is through Next API routes:
- Driver routes verify Supabase Auth then use server-side credentials.
- Customer token route uses server-side DB lookup by token.

Rationale:
- Keeps rules centralized in the Next backend.
- Avoids complex RLS for token-only customers (MVP).

## Fare Estimation

The system supports two modes:

1. Local deterministic estimate (always available):
   - `estimateDistanceFromText()` hashes pickup/drop strings into a bounded km value.
   - Used for `/api/estimate` preview and as fallback.

2. Google Distance Matrix estimate (optional, server-only):
   - Called only on booking creation.
   - Disabled if `GOOGLE_MAPS_API_KEY` is empty.
   - If the route exists in prior bookings, the system reuses the last known distance (reduces paid calls).

Important:
- Google API keys restricted by HTTP referrer will fail for server calls.
- Use unrestricted or IP-restricted keys for server-side usage.

## Environment Variables

See `.env.example` for the full list. Key groups:

Driver display:
- `NEXT_PUBLIC_DRIVER_*`

Supabase DB (server-only):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Supabase Auth (browser-safe):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DRIVER_AUTH_EMAIL` (optional allow-list)

Driver PWA notifications:
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

Fare config:
- `NEXT_PUBLIC_CURRENCY`
- `FARE_BASE_AED`, `FARE_PER_KM_AED`, `FARE_MIN_DISTANCE_KM`, `FARE_MAX_DISTANCE_KM`

Google (optional, server-only):
- `GOOGLE_MAPS_API_KEY`
- `GOOGLE_MAPS_REGION`

## Database Schema

Canonical schema lives in:
- `supabase/schema.sql`

Important columns:
- `id` (uuid)
- `access_token` (text unique)
- pickup/drop/time/phone
- `estimated_price`, `expected_price`, `final_price`
- `estimated_distance_km`, `estimated_duration_minutes`, `estimate_source`
- `status`, `notes`, `created_at`, `updated_at`

## Local Development

1. Install:
   - `npm install`
2. Configure:
   - Copy `.env.example` to `.env.local` and set values.
3. Run:
   - `npm run dev`

Default URLs:
- Customer: `http://127.0.0.1:3000`
- Driver: `http://127.0.0.1:3000/driver`

## Code Map (Where To Change What)

Core booking behavior:
- `lib/bookings/types.ts` types and fields
- `lib/bookings/validation.ts` input validation
- `lib/bookings/status-flow.ts` allowed status transitions + UI behavior
- `lib/bookings/pricing.ts` fare estimation (local + optional Google)
- `lib/bookings/repository.ts` database layer (Supabase)

API:
- `app/api/bookings/route.ts`
- `app/api/bookings/[id]/route.ts`
- `app/api/bookings/token/[token]/route.ts`

Auth:
- `components/DriverAuthGate.tsx` driver login UI
- `lib/auth/driver.ts` API protection
- `lib/supabase/server.ts` server-only Supabase client
- `lib/supabase/browser.ts` browser Supabase Auth client

UI:
- `components/BookingForm.tsx` customer booking + confirmation + private link
- `components/DriverDashboard.tsx` driver actions and per-record errors
- `components/CustomerBookingView.tsx` token-based booking view
- `app/globals.css` themes + responsive layout

## Conventions / Guardrails

- Keep customer flow frictionless (no login, no OTP).
- Keep driver operations secure (driver-only APIs must remain protected).
- Do not expose secrets in `NEXT_PUBLIC_*` env vars.
- Prefer adding logic to the repository layer rather than sprinkling DB calls across API/UI.
- Keep new features modular and reversible (this project is an MVP).

## Common Gotchas

- If you change `.env.local`, restart `npm run dev` (Next reads env at startup).
- Hydration mismatches can happen if client code reads env differently than server rendering; pass server-derived data into client components as props.
- If Google distance calls fail, check API key restrictions (referrer restriction will fail server-side).
