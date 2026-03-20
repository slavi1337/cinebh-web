# CineBH - Web Application

CineBH is a modern, web-based ticketing application designed for a movie theater company.
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

- `src/__tests__` - Global integration and flow tests.
- `src/assets` - Global icons, images, and base styles.
- `src/components` - Reusable UI components (buttons, inputs, etc.) and their unit tests.
- `src/pages` - Feature-based views (Homepage, Movie Details, Profile).
- `src/services` - API integration logic and backend communication.
- `src/hooks` - Shared custom React hooks.
- `src/types` - TypeScript interfaces and domain-specific models.
- `src/utils` - Helper functions and utility constants.
- `src/tests` - Test environment configurations (Vitest setup).

## Getting Started

### Prerequisites

- **Node.js:** v20.x or higher (LTS recommended)
- **npm:** v10.x or higher

### Installation & Local Development

1. **Clone the repository:**

   ```bash
   git clone -b develop https://github.com/slavi1337/cinebh-web.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Run unit tests:**
   ```bash
   npm run test
   ```
