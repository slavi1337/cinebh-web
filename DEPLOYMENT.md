# Cinebh Web Deployment Guide

This document describes how the Cinebh frontend is built and deployed, and which backend/proxy assumptions must hold
for the application to work correctly in production.

## Deployment Overview

The frontend is a React/Vite single page application. The production container builds static assets with Node and then
serves them through Nginx.

The deployed application depends on:

- a reachable Cinebh backend API
- correct API base URL configuration during frontend build
- reverse proxy support for SPA routes
- reverse proxy support for backend routes used by REST and Google OAuth
- HTTPS on the public domain

## Production Build

The production image is built by the repository `Dockerfile`.

Build stage:

- uses `node:22-alpine`
- installs dependencies with `npm ci`
- accepts `VITE_API_BASE_URL` as a build argument
- runs `npm run build`

Runtime stage:

- uses `nginx:1.27-alpine`
- serves the generated `dist` directory
- uses `nginx.conf` from this repository
- exposes port `80`

Manual build example:

```bash
docker build \
  --build-arg VITE_API_BASE_URL="" \
  -t cinebh-web:latest .
```

For same-origin deployments, `VITE_API_BASE_URL` can be empty. In that mode, the app calls relative API/OAuth routes and
the edge Nginx/proxy must forward the backend routes.

For split frontend/backend domains, set:

```text
VITE_API_BASE_URL=https://api.example.com/api/v1
```

REST calls use `/api/v1`, but Google OAuth routes intentionally do not. The frontend strips `/api/v1` before redirecting
to `/oauth2/authorization/google`.

## Runtime Routing Requirements

The frontend is an SPA, so browser routes must fall back to `index.html`.

The public reverse proxy must also forward these backend paths to the backend service:

```text
/api/**
/swagger-ui/**
/v3/api-docs/**
/oauth2/**
/login/**
```

The OAuth paths are required for Google login:

```text
/oauth2/authorization/google
/login/oauth2/code/google
```

If these paths are not routed to the backend, normal email/password auth may work while Google login fails.

## Nginx Notes

The Nginx config in this repository serves the SPA and proxies API traffic to a backend container named `backend`:

```text
https://backend:8443
```

In the combined Docker Compose setup, frontend and backend must be in the same Docker network so this service name
resolves.

Production edge Nginx or an ingress should terminate public TLS and forward requests to the frontend/backend services.
For backend requests, preserve forwarded headers:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Forwarded-Proto https;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

Those headers are important for Spring Security OAuth redirect URI generation.

## Jenkins Pipeline

The deployment currently follows this model:

1. Jenkins has a frontend build job that targets this GitHub repository and the selected branch.
2. Jenkins injects build-time configuration such as `VITE_API_BASE_URL`.
3. The job builds the Docker image.
4. A separate deploy pipeline combines the frontend and backend builds in the same Docker network on the EC2 instance.
5. Nginx exposes the frontend and backend to the web and terminates HTTPS traffic.

Secrets should be stored in Jenkins credentials, not committed to the repository.

## Google OAuth Deployment Checklist

For the deployed domain, Google Console must include:

Authorized JavaScript origin:

```text
https://<frontend-public-domain>
```

Authorized redirect URI:

```text
https://<frontend-public-domain>/login/oauth2/code/google
```

Example for the internship deployment:

```text
https://cinebhapp.praksa.abhapp.com/login/oauth2/code/google
```

If the backend is exposed on a separate public domain, the redirect URI must match the backend public domain instead.
Always copy the exact `redirect_uri` value from Google's error page when debugging `redirect_uri_mismatch`.

## Local HTTPS Development

Local development uses HTTPS so cookies and Google OAuth behave similarly to production.

Add local host mappings:

```text
127.0.0.1 cinebh.com
127.0.0.1 api.cinebh.com
```

Create `.env`:

```env
VITE_API_BASE_URL=https://api.cinebh.com:8443/api/v1
```

Start the frontend:

```bash
npm install
npm run dev
```

Open:

```text
https://cinebh.com:5173
```

The project uses `@vitejs/plugin-basic-ssl`, so the browser may ask you to trust the local development certificate.

## Verification After Deployment

Verify:

- `/` loads the frontend
- direct refresh on SPA routes works, for example `/currently-showing`
- public listing pages load data
- movie details routes load data and projection times
- city/cinema filters are synchronized on Currently Showing and Upcoming Movies
- Google login redirects to Google and back to `/login/oauth2/code/google`
- auth cookies are created with the expected domain, `Secure`, `HttpOnly`, and `SameSite` settings
- `/api/v1/auth/me` returns the current user after login

## Troubleshooting

### Frontend loads but API calls fail

Check:

- `VITE_API_BASE_URL`
- reverse proxy `/api/**` route
- backend container health
- CORS allowed origins
- browser Network tab

### Google login fails with `redirect_uri_mismatch`

Check:

- Google Console authorized redirect URI
- public domain used by the browser
- `/oauth2/**` and `/login/**` proxy routes
- forwarded `Host` and `X-Forwarded-Proto` headers

### Google login succeeds but `/me` returns 401

Check:

- backend JWT secret
- auth cookie domain and `SameSite` policy
- frontend and backend public domains
- whether the OAuth user was created in the deployed database
