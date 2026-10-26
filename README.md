# Route Posts learning project

A responsive React + TypeScript authentication UI inspired by Route Posts, built with Tailwind CSS v4 and Flowbite React. Login and account creation use the documented Route Posts API.

## Run locally

1. Install dependencies with `npm install`.
2. Start Vite with `npm run dev`.
3. Open the local URL printed in the terminal.

## Checks

- `npm run build` — type-check and production build.
- `npm run lint` — run ESLint.

## Beginner guide

Read [`BEGINNER_GUIDE.md`](./BEGINNER_GUIDE.md) for a step-by-step explanation of the project structure, routes and Outlet, Flowbite/Tailwind setup, forms and validation, API requests, session storage, testing, and how to add API-backed social features safely.

## API scope

The app integrates documented signup, signin, and password-change endpoints. The Postman docs available during implementation did not provide complete request schemas for posts/comments/notifications, so those calls are intentionally not guessed or simulated. Password recovery is shown as unavailable until a recovery endpoint is documented.

The API URL is public configuration. Never commit real credentials, access tokens, or test-account secrets.
