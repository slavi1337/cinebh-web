# Cinebh - Web Application

Cinebh is a modern, web-based ticketing application designed for a movie theater company.
This repository contains the React frontend, providing users with a seamless interface for movie discovery, seat selection, and secure ticket purchasing.

## Tech Stack

- **Framework:** React 19 (Latest stable release)
- **Build Tool:** Vite 8
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4

## Key Libraries & Dependencies

To ensure scalability and maintainability, the following libraries have been integrated:

### Core & Navigation

- **`react-router-dom`**: The industry standard for handling navigation and routing in Single Page Applications.
- **`axios`**: A promise-based HTTP client used for backend API communication. Chosen over the native Fetch API for its superior error handling and support for interceptors.

### Testing Suite

- **`vitest`**: A Vite-native unit testing framework. It provides a significantly faster development cycle compared to Jest by leveraging the same transform pipeline as the app.
- **`@testing-library/react`**: Provides utilities for testing React components from the user's perspective, ensuring accessibility and reliable UI logic.
- **`jsdom`**: A JavaScript implementation of the DOM, allowing us to simulate browser behavior in a terminal environment during testing.

## Project Structure

The project follows a clean, feature-organized directory structure:

- `src/assets` - Global icons and images.
- `src/components` - Reusable application components.
  - `common` - Shared components such as filter select, empty state, and status card
  - `home` - Homepage-specific shared sections and helpers
  - `currently-showing` - Components specific to the currently showing page
  - `upcoming-movies` - Components specific to the upcoming movies page
  - `layout` - Shared layout components such as `Navbar`, `Footer`, and `MainLayout`.
  - `ui/buttons` - Reusable button components.
  - `ui/icons` - Reusable SVG icon components.
- `src/pages` - Page-level views
- `src/services` - API integration logic and backend communication.
- `src/hooks` - Shared custom React hooks.
- `src/types` - TypeScript interfaces and domain-specific models.
- `src/utils` - Helper functions and utility constants.
- `src/constants` - Shared constants such as API endpoints
- `src/tests` - Test environment configurations(Vitest setup) and global tests.

## Main Features Implemented

- Homepage sections
- Static About Us and Tickets pages
- Currently Showing page with:
  - title search
  - city filter
  - cinema filter
  - genre filter
  - projection time filter
  - ten-day schedule selector
  - load more pagination
  - URL-synced filters and pagination
- Upcoming Movies page with:
  - title search
  - city filter
  - cinema filter
  - genre filter
  - date range filter
  - load more pagination
  - URL-synced filters and pagination
- Shared listing utilities and reusable UI components
- Responsive layout

## Getting Started

### Prerequisites

Before running the frontend locally, install:

- **Node.js:** v20.x or higher (LTS recommended)
- **npm:** v10.x or higher

Recommended:

- VS Code or WebStorm
- browser dev tools
- backend API running

### Repository Setup

Clone the frontend repository and enter the project folder.

```bash
git clone https://github.com/slavi1337/cinebh-web.git
cd cinebh-web
```

### Install dependencies

Install all packages with:

```bash
npm install
```

This installs, among others:

- React and React Router
- Axios
- Tailwind CSS v4
- React Day Picker
- Radix UI Popover
- Vitest

### Environment Configuration

Create a local environment (.env) file in the root of the project.

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Do not commit real environment-specific secrets.

### Running the Application

Start the local development server with:

```bash
npm run dev
```

Vite will print the local URL, typically:

```text
http://localhost:5173
```

### Production Build

Create a production build with:

```bash
npm run build
```

Preview the built application locally with:

```bash
npm run preview
```

### Running Tests

Run unit/component tests with:

```bash
npm run test
```

### Backend Dependency

The frontend depends on the backend API being available.

For full local functionality, make sure the backend is running and configured correctly.

Important API areas used by the frontend include:

- homepage movie data
- currently showing listing
- currently showing filters and venues-by-city endpoint
- upcoming movies listing
- upcoming movies filters and venues-by-city endpoint
- venues listing

### API Endpoint Organization

The frontend keeps API route strings centralized in constants.

This helps with:

- easier maintenance
- fewer duplicated endpoint strings
- simpler future environment changes

### URL-Based Listing State

Currently Showing and Upcoming Movies pages keep search/filter/pagination state in the URL.

Benefits:

- page can be refreshed without losing filter state
- URLs can be shared
- pagination and filters are easier to debug

Examples:

- search by title
- selected city/cinema/genre
- selected date or date range
- current page for load more pagination

### Currently Showing Notes

The Currently Showing page includes:

- a default current date in the URL if none is selected
- a ten-day date selector
- projection time filter that depends on available showtimes
- venue filtering based on selected city

To test it properly, the backend/database should include:

- currently showing movies
- multiple cities
- multiple cinemas
- projections across multiple dates and times

### Upcoming Movies Notes

The Upcoming Movies page includes:

- search by title
- city/cinema/genre filters
- custom date range picker built with React Day Picker and Radix Popover
- load more pagination
- venue filtering based on selected city

To test it properly, the backend/database should include:

- enough upcoming movies for multiple pages
- future projections in multiple venues/cities
- release dates both near-term and farther in the future

### Additional UI / Package Notes

#### React Day Picker + Radix Popover

Used to implement the custom date range picker for Upcoming Movies.

This requires the packages:

- `react-day-picker`
- `@radix-ui/react-popover`

#### Tailwind CSS v4

The project uses Tailwind v4 for styling, including:

- theme variables
- shared utility classes
- shared component classes such as body text sizing

### Environment Differences

#### Local Development

- frontend usually points to local backend
- easiest for debugging and UI changes
- may use locally seeded/tested API data

#### Production

- should use production API base URL
- should be built and deployed with correct environment variables
- should be tested for API availability, routing, and asset handling

## Troubleshooting

### Frontend starts but data does not load

Check:

- backend is running
- `VITE_API_BASE_URL` is correct
- browser network tab for failed API calls
- CORS configuration on backend

### Filters show empty options

Check:

- backend filters endpoint is available
- backend has seeded data
- future projections exist for upcoming page
- current schedules exist for currently showing page

### Load More does not return additional items

Check:

- backend pagination response fields
- page and size query params
- URL state after clicking load more
- whether the backend actually has more than one page of data

### Date range picker does not behave correctly

Check:

- required packages are installed
- no broken imports after branch merges/rebases
- disabled state and URL params are handled correctly

### TypeScript path alias issues

If aliases such as `@/` fail:

- verify Vite config aliases
- verify TypeScript config paths
- make sure branch merge/rebase conflicts did not revert configuration

### UI looks broken after install

Check:

- `npm install` completed successfully
- Tailwind CSS is loaded
- global `index.css` is imported correctly
- no missing assets or icons after branch changes

## Deployment Notes for DevOps

To deploy the frontend successfully, DevOps should ensure:

- correct Node/npm version in the build environment
- correct frontend environment variables
- correct backend API base URL for the target environment
- correct static asset serving configuration
- SPA routing support on the hosting platform

## Suggested Local End-to-End Setup

1. Start PostgreSQL and required backend services
2. Start the backend API locally
3. Install frontend dependencies with `npm install`
4. Configure frontend environment variables if needed
5. Run `npm run dev`
6. Open the frontend in the browser
7. Verify homepage, currently showing, and upcoming pages against seeded backend data

## Quick Start Summary

1. Install Node.js and npm
2. Clone the repository
3. Run `npm install`
4. Configure `VITE_API_BASE_URL` if needed
5. Start the backend
6. Run `npm run dev`
7. Open the app in the browser and test the listing pages
