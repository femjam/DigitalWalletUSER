# Wallet App — Frontend

A React frontend for the **Digital Wallet & Transfer Platform** backend (Laravel 11 + JWT). Users can register, log in with two-factor authentication, view multi-currency wallet balances, fund their wallet, transfer funds to other users, and browse their transaction history.

> **Backend API:** [walletapp-api](https://github.com/femjam/DigitalWalletAPI)

---

## Live Demo

- **Frontend:** https://wallet-user.icrystal.org.ng
- **API:** https://wallet.icrystal.org.ng/api

### Demo Credentials

| Email | Password | Wallet |
|---|---|---|
| `james.ayetemimowa@gmail.com` | `----------` | 


**2FA:** Login is protected by a 6-digit OTP. The code is delivered to the email address on file. If you cannot receive email in the test environment, use the API logs on the backend server (see the [backend README](https://github.com/femjam/DigitalWalletAPI)) or register using an email you can access so you can get the 2FAA code. 
---

## Features

- **Registration** — create an account with email + password, verify via OTP
- **Login** — credentials → OTP → JWT
- **Session persistence** — JWT stored in `localStorage`, user re-hydrated on refresh
- **Wallet dashboard** — view balances in NGN, USD, and USDT
- **Wallet funding** — simulated top-up with idempotent submission
- **Peer-to-peer transfers** — send money by recipient email with optional narration and reference
- **Transaction history** — paginated list with status badges
- **Transaction details** — view a single transaction by reference
- **Responsive layout** — works on desktop, tablet, and mobile
- **Loading, empty, error, success states** throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Create React App (`react-scripts` 5) |
| Routing | React Router 7 |
| State management | React Context API |
| HTTP client | Axios |
| Styling | Bootstrap 5 + custom CSS |
| Auth | JWT (bearer tokens) |

---

## Project Structure
walletapp-frontend/
├── public/
│ ├── index.html
│ ├── favicon.ico
│ └── manifest.json
├── src/
│ ├── api/ Axios client + endpoint wrappers
│ │ ├── client.js Base instance (reads REACT_APP_API_URL)
│ │ ├── auth.js /auth/* endpoints
│ │ ├── wallet.js /wallets/* endpoints
│ │ └── transactions.js /transactions/* endpoints
│ ├── context/
│ │ ├── AppContext.js Global state provider
│ │ ├── useGlobalValue.js
│ │ └── useSetGlobalValue.js
│ ├── routes/
│ │ └── AppRoutes.js Route definitions
│ ├── pages/ Page-level components
│ ├── components/ Reusable UI pieces
│ ├── App.js Root component + auth hydration
│ └── index.js Entry point
├── .env Local API URL
├── .env.production Production API URL
├── package.json
└── README.md

text

---

## Getting Started (Local)

### Requirements

- Node.js 18+
- npm 9+
- The backend API running (locally or remotely — see [walletapp-api](https://github.com/femjam/DigitalWalletAPI))

### Installation

```bash
git clone https://github.com/femjam/walletapp-frontend.git
cd walletapp-frontend
npm install
Configure the API URL
Edit .env:

env
REACT_APP_API_URL=http://127.0.0.1:1919/api
Replace with wherever your backend is running:

Laragon: http://127.0.0.1:1919/api

php artisan serve: http://localhost:8000/api

Deployed backend: https://wallet.icrystal.org.ng/api

Only variables prefixed with REACT_APP_ are exposed to the browser bundle. Do not put secrets in these files.

Run
bash
npm start
Opens at http://localhost:3000.

Building for Production
bash
npm run build
Output goes to build/. Static HTML/CSS/JS — deployable to any web server.

CRA automatically reads .env.production during the build. It's already set up:

env
REACT_APP_API_URL=https://wallet.icrystal.org.ng/api
Deployment (cPanel)
This project deploys as static files. No Node runtime is required on the server.

1. Build locally
bash
npm run build
2. Create a subdomain
In cPanel → Domains → Create A New Domain:

Domain: wallet-user.icrystal.org.ng

Document root: cPanel's default (e.g., /home/icrystal/public_html/wallet-user.icrystal.org.ng)

3. Upload the build
Open File Manager → navigate to the subdomain docroot → upload the contents of build/ (not the folder itself).

Final structure:

text
wallet-user.icrystal.org.ng/
├── index.html
├── asset-manifest.json
├── favicon.ico
├── manifest.json
├── robots.txt
└── static/
    ├── css/
    ├── js/
    └── media/
4. Add .htaccess for React Router
Create .htaccess in the docroot:

apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
Why this matters: React Router handles routes client-side. Without this rule, refreshing any route (e.g., /dashboard) returns 404 because Apache looks for a real file that doesn't exist.

5. Enable SSL
cPanel → SSL/TLS Status → run AutoSSL for the subdomain. Wait ~1 minute.

6. Allow the frontend in the backend's CORS
In the Laravel backend's config/cors.php, add:

php
'allowed_origins' => [
    'http://localhost:3000',
    'https://wallet-user.icrystal.org.ng',
],
Run php artisan config:clear on the backend server if you've cached config.

How Authentication Works
Register / login → the backend sends a 6-digit OTP to the user's email.

Verify OTP → the backend returns a JWT.

Store token → localStorage.setItem('token', jwt).

Every API request → axios interceptor attaches Authorization: Bearer <token>.

Page refresh → App.js → Bootstrap checks localStorage, calls /auth/me, and hydrates the user into global state.

Expired token → the API returns 401, and the axios interceptor clears the token and redirects to /login.

The user object and token live in AppContext and are accessed via useGlobalValue('user') / useSetGlobalValue().

Idempotency
Money-moving requests (POST /wallets/fund, POST /transactions) send an Idempotency-Key header — a UUID generated client-side per submission attempt.

This protects against:

Double-clicking the send button

Retrying after a network blip

Refreshing mid-submission

Backend timeouts where the request did execute but the response was lost

If the backend detects a similar recent transaction, it returns 409 POSSIBLE_DUPLICATE. The UI prompts the user to confirm, then resubmits with confirm_duplicate: true.

Available Scripts
Command	Purpose
npm start	Dev server at http://localhost:3000
npm run build	Production build into build/
npm test	Run tests (CRA default setup)
npm run eject	Eject from CRA (irreversible)
Environment Variables
Variable	Where	Purpose
REACT_APP_API_URL	.env, .env.production	Backend API base URL
Only variables starting with REACT_APP_ are exposed to the browser bundle.

Known Limitations
Create React App is used instead of Vite. CRA is deprecated upstream (though still functional). Migrating to Vite would speed up builds and reduce bundle size.

No automated tests. CRA scaffolds a test runner, but no tests are written yet. This is a candidate for the next iteration.

Token stored in localStorage. Vulnerable to XSS if a script is injected into the page. A production fintech would use HTTP-only cookies with CSRF protection.

No offline support. Network failures surface errors; there is no cached view.

No websockets or real-time updates. Balances refresh on action, not automatically.

Related Repositories
Backend API: https://github.com/femjam/DigitalWalletAPI