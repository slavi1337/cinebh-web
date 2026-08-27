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

## Screenshots

The screenshots follow the main user journey from discovering a movie to booking seats, completing payment and managing
the resulting ticket.

### Discover Movies

**Home**

The landing page highlights featured movies and provides direct access to the ticket flow.

<img width="2880" height="1800" alt="home" src="https://github.com/user-attachments/assets/c66114bb-302a-4ce4-a85a-2f1b2353ba0b" />

<br><br>

**Currently Showing**

Movies can be filtered by city, cinema, genre, date and projection time. Showtimes are grouped by cinema and hall.

<img width="2880" height="1800" alt="currently-showing" src="https://github.com/user-attachments/assets/d3c44707-bf1d-4004-bbab-b8143e39ab37" />

<br><br>

**Upcoming Movies**

Upcoming releases remain visible even before projection schedules are published.

<img width="2880" height="1800" alt="upcoming-movies" src="https://github.com/user-attachments/assets/e4b539d4-6ceb-478e-bc67-bb7b08bb979d" />

<br><br>

<img width="2880" height="1800" alt="upcoming filter" src="https://github.com/user-attachments/assets/22a6bb80-784c-44b0-b7f0-dd34fb0db46c" />

<br><br>

### Authentication

**Sign In**

Users can sign in with email and password, choose a persistent session or continue with Google OAuth.

<img width="2880" height="1800" alt="sign-in" src="https://github.com/user-attachments/assets/b2a79e41-d99a-4e3a-8c81-cb81b1211d0e" />

<br><br>

**Sign Up**

Registration includes client and server-side validation, email verification and Google OAuth.

<img width="2880" height="1800" alt="sign-up" src="https://github.com/user-attachments/assets/f0244260-b759-4bc1-a015-0881ca222438" />

<br><br>

<img width="535" height="900" alt="validation3" src="https://github.com/user-attachments/assets/7ef0a3ab-f0ee-4e75-872c-36ed635e14ef" />

<br><br>

<img width="535" height="900" alt="validation2" src="https://github.com/user-attachments/assets/a229c060-5854-4f84-aeaf-e90be116c94c" />

<br><br>

<img width="535" height="900" alt="validation" src="https://github.com/user-attachments/assets/114d439b-a656-46f1-96df-df59be9e6406" />

<br><br>

**Code Verification**

<img width="2880" height="1800" alt="code verification" src="https://github.com/user-attachments/assets/dfe9dd77-24c6-405d-8af3-a88eab29a667" />

<br><br>

### Booking Flow

**Movie Details**

The details page combines metadata, cast, ratings, a trailer, image gallery and grouped showtimes.

<img width="2880" height="1800" alt="movie-details" src="https://github.com/user-attachments/assets/d8b0b350-a35f-4635-9543-464264620767" />

<br><br>

<img width="2880" height="1800" alt="movie-details-2" src="https://github.com/user-attachments/assets/4bbfe6d6-9e33-4c92-99c6-22ba3b63c67a" />

<br><br>

**Seat Selection**

Available, held and selected regular, love and VIP seats are displayed with a five-minute booking timer.

<img width="2880" height="2034" alt="seat-selection" src="https://github.com/user-attachments/assets/d21edb20-b706-4dc5-8ac6-ba5f80c98293" />

<br><br>

**Pending Reservation**

Reserved seats can be purchased before expiration or released by cancelling the reservation.

<img width="2848" height="2034" alt="pending-reservation" src="https://github.com/user-attachments/assets/1225623d-1462-489f-ac88-3e4ffb29c693" />

<br><br>

### Payments and Tickets

**Stripe Checkout**

Payment details are collected by Stripe Checkout in its sandbox environment, outside the Cinebh frontend.

<img width="2848" height="2034" alt="stripe-checkout" src="https://github.com/user-attachments/assets/da2500ef-36da-46a9-a878-9c3a4de25249" />

<br><br>

**Payment Confirmation**

The return page waits for the signed Stripe webhook before presenting the confirmed ticket.

<img width="2848" height="2034" alt="payment-success" src="https://github.com/user-attachments/assets/fb94cb86-0c9e-4829-9d9e-c404ca2b3aa5" />

<br><br>

**Ticket Validation**

Ticket data and its QR code are validated by the backend rather than trusted from QR payload data alone.

<img width="834" height="1006" alt="mail-confirmation" src="https://github.com/user-attachments/assets/a62460d2-7162-41ac-91e5-ad191509236b" />

<br><br>

<img width="2848" height="2034" alt="ticket-validation" src="https://github.com/user-attachments/assets/e1fcd3cd-d3b9-432c-864e-a234299e1653" />

<br><br>

### User Profile

**Personal Information**

Registered users can update profile information and upload an avatar stored through the S3-compatible storage service.

<img width="2880" height="1800" alt="profile-information" src="https://github.com/user-attachments/assets/ebcbcb40-c841-4bd8-82cc-e79b91f3a00b" />

<br><br>

**Projection History**

Purchased tickets are separated into upcoming and past projections.

<img width="2886" height="1798" alt="profile-projections" src="https://github.com/user-attachments/assets/a9974c32-a22a-4697-9234-0b679520f0f7" />

<br><br>

### Responsive Design

Navigation, movie discovery, booking and profile pages adapt to mobile screen sizes.

<img width="1290" height="2796" alt="mobile-home" src="https://github.com/user-attachments/assets/70b236bf-b801-4545-8eef-385846d5a1be" />

<br><br>

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
