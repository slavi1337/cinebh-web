# Cinebh Web

Frontend for Cinebh, a cinema browsing and ticket booking application.

The application is built with React and communicates with the
[Cinebh API](https://github.com/slavi1337/cinebh-api). Card details are handled by Stripe Checkout and are never
collected by this frontend.

## Features

- Homepage with currently showing movies, upcoming releases and cinemas
- About Us and ticket pricing pages
- Search and URL-synchronized filters by city, cinema, genre, date and projection time
- Movie details with metadata, cast, media gallery, related movies and grouped showtimes
- Email/password authentication, email verification and Google OAuth
- HttpOnly cookie authentication with automatic access-token refresh
- Seat selection for regular, love and VIP seats
- Five-minute seat hold with live WebSocket seat-map updates
- Ticket purchase through Stripe-hosted Checkout
- Ticket reservations with expiration, cancellation and later checkout
- Payment confirmation and ticket view with backend-validated QR code
- User profile editing, avatar upload, password change and account deactivation
- Upcoming and past purchased projections
- Responsive layouts for listing, booking and profile pages

## Tech Stack

- React 19
- TypeScript
- Vite 8
- React Router
- Tailwind CSS 4
- Axios
- Zod
- Vitest and Testing Library

## Local Setup

### Requirements

- Node.js 22
- npm 10 or newer
- Cinebh API running locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/slavi1337/cinebh-web.git
cd cinebh-web
npm ci
```

Add the local domains to the hosts file:

```text
127.0.0.1 cinebh.com
127.0.0.1 api.cinebh.com
```

Create `.env` in the project root:

```env
VITE_API_BASE_URL=https://api.cinebh.com:8443/api/v1
```

Start the development server:

```bash
npm run dev
```

Open `https://cinebh.com:5173`. Local development uses a self-signed HTTPS certificate, so the browser may ask you to
trust it. The backend must also be available over local HTTPS.

`VITE_API_BASE_URL` must include `/api/v1`. Google OAuth and WebSocket URLs are derived from the same configured base
URL. A same-origin production build can instead use `/api/v1` and proxy API, OAuth and WebSocket requests through
Nginx.

## Available Scripts

```bash
npm run dev          # start the Vite development server
npm run build        # type-check and create a production build
npm run preview      # preview the production build
npm run lint         # run ESLint
npm test -- --run    # run tests once
npm run test:ui      # open the Vitest UI
```

## Project Structure

```text
src/
  components/   reusable and feature-specific UI
  constants/    routes, API endpoints and shared constants
  context/      authentication state
  hooks/        shared React hooks
  pages/        route-level pages
  schemas/      Zod validation schemas
  services/     HTTP and WebSocket integration
  types/        API and domain types
  utils/        formatting and shared helpers
```

## Backend Integration

Axios is configured with `withCredentials: true` because access and refresh tokens are stored in backend-managed
HttpOnly cookies. The frontend does not store JWTs in local or session storage.

Seat changes are persisted through REST endpoints. A projection-specific WebSocket connection receives seat-map
events so concurrent users can see availability changes without polling.

Stripe Checkout redirects back to the application after payment. The backend treats the signed Stripe webhook as the
source of truth before marking a booking as paid and issuing a ticket.

## Additional Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for the original Docker, Nginx, OAuth and local HTTPS setup notes.

## License

No open-source license is currently included in this repository.
