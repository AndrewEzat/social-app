# Route Posts: beginner walkthrough

This guide explains how the current app is organized and how to run it. The interface is inspired by the public Route Posts demo, but the logos/visual art here are original CSS treatments. The documented API calls currently wired are signup and signin.

## 1. Start the project

1. Install Node.js (the current project was tested with Node 24) and open this folder in VS Code.
2. Open the VS Code terminal in the project root.
3. Run `npm install` once to install the dependencies from `package.json`.
4. Run `npm run dev` and open the local URL printed by Vite (usually `http://localhost:5173`).
5. Stop the server with Ctrl+C in that terminal.

Useful commands:

- `npm run dev` — start the development server with hot reload.
- `npm run build` — type-check and create the production build in `dist/`.
- `npm run lint` — check code style and common mistakes.
- `npm run preview` — preview an already-created production build.

## 2. Understand the folders

- `src/main.tsx` starts React and imports the global stylesheet.
- `src/App.tsx` declares browser routes and wraps the app with `AuthProvider`.
- `src/Components/AuthLayout.tsx` is the shared two-column authentication layout. Its `<Outlet />` is where Login, Register, and Forgot Password pages render.
- `src/Pages/Login.tsx` and `src/Pages/Register.tsx` contain the forms.
- `src/Components/ProtectedRoute.tsx` prevents opening the signed-in profile without a session.
- `src/Pages/Profile.tsx` is the signed-in confirmation/profile placeholder and logout control.
- `src/context/AuthContext.tsx` holds the current token/user and exposes sign-in, sign-up, and sign-out actions.
- `src/services/authApi.ts` contains the HTTP requests and API error handling.
- `src/index.css` turns on Tailwind CSS v4 and the Flowbite React Tailwind plugin.
- `src/App.css` contains app-specific responsive layout and visual styles.

## 3. How routing and Outlet work

React Router maps URLs to page components. In `src/App.tsx`, `/login`, `/register`, and `/forgot-password` render inside `AuthLayout`. `AuthLayout` keeps the academy information, product title, and tabs in place; `<Outlet />` swaps the form page inside the card. `/profile` uses `ProtectedRoute`; if there is no token, it redirects to `/login`.

To add a new page, create a component under `src/Pages/`, import it in `src/App.tsx`, then add a route. Decide whether it is public or should be nested under a route guard.

## 4. How the forms work

Both auth forms use React Hook Form. `register()` connects an input to form state, validation rules run before submission, and `handleSubmit()` calls the async submit handler only when local validation passes. The UI shows field-level messages, disables the button while a request is in progress, and displays server errors in an alert.

The signup UI collects full name, optional username, email, gender, date of birth, password, and confirmation. Confirmation is checked in the browser but not sent as a separate API field; the API expects `rePassword` to match `password`.

## 5. How the API request works

`src/services/authApi.ts` sends JSON to the public API base `https://route-posts.routemisr.com`:

- `POST /users/signin` with the user's email/username in `login` and the password.
- `POST /users/signup` with the documented account fields.
- `PATCH /users/change-password` with the current password and new password plus the `Authorization: Bearer <token>` header.

The service checks HTTP status and the documented `{ success, message, data, meta }` response envelope. It turns server validation messages and network failures into readable errors. It looks for a token in the returned auth data rather than hard-coding a test token.

The API base URL is public configuration, not a secret, so it is in the client service. Never put a real password, API key, or a user's token into source control.

## 6. How sign-in state works

After a successful signup or login request, `AuthContext` stores the returned token and user (when provided) in `sessionStorage`. `sessionStorage` lasts for the current browser tab and is cleared when that tab closes. The route guard checks whether the token exists. Logout clears the stored values and redirects to login. The password-change request includes that token and updates it if the API returns a refreshed one.

Browser storage is accessible to JavaScript running on the same page, so it is not equivalent to a secure, HTTP-only cookie. A production app should use a backend-managed secure cookie where possible, protect against cross-site scripting, and follow the API provider's security guidance.

## 7. How to add the social feed later

The supplied documentation's dynamic Posts, Comments, and Notifications sections did not expose complete request schemas in the available research. Do not guess endpoint paths or payload shapes. Before implementing a feed, confirm each endpoint's method, URL, authorization header, request body, pagination, and response format in the Postman collection. Then add typed functions to `src/services/`, build components/pages that call those functions, and show loading, empty, error, and success states. Keep the API logic out of presentation components.

## 8. Test the app yourself

1. Open `/register`, submit an empty form, and confirm required-field messages appear without a request.
2. Enter mismatched passwords and verify signup is blocked.
3. Submit valid test credentials only if you are allowed to create an account on the public service. Confirm server validation/network errors appear clearly.
4. Try login with an authorized test account; on success the app should show the signed-in page.
5. Refresh the tab and check the session remains. Open `/profile` in a fresh tab and confirm it redirects to login.
6. Click Log out and confirm the protected page redirects.
7. Run `npm run build` and `npm run lint` before sharing changes.

## 9. Customize the design

Start with the classes in `src/App.css`: `.auth-shell` controls the split layout, `.academy-panel` the dark intro panel, `.auth-card` the white form card, and the `@media` blocks the tablet/mobile layouts. Flowbite React supplies accessible input/button/select components, and Tailwind utility classes can be used directly in JSX. Keep labels connected to input IDs and preserve keyboard focus styles when changing colors.
