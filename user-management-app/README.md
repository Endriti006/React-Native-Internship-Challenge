# User Management App

An Expo-powered React Native experience that showcases a polished user directory with search, detail views, and full CRUD flows powered by Redux Toolkit.

## ✨ Features

- Remote fetch from `https://jsonplaceholder.typicode.com/users` with graceful loading and retry states
- Instant client-side search on name and email
- Detailed profile screen with gradient hero, contact info, and company/address breakdown
- Add, update, and delete teammates locally with schema validation via `react-hook-form` and `yup`
- Global state managed by Redux Toolkit, ready for future persistence or networking

## 🚀 Quick start

```bash
npm install
npm run lint # optional, ensures the project stays warning-free
npx expo start
```

Scan the QR code with Expo Go or launch on your preferred simulator from the CLI prompts.

## 🗂️ Project structure highlights

- `app/_layout.jsx` – sets up theming, Redux provider, and stack routes
- `app/index.jsx` – gradient user list with search, pull-to-refresh, and floating action button
- `app/user/[id].jsx` – immersive detail view with edit/delete actions
- `app/user/manage.jsx` – modal form for creating and updating teammates
- `store/` – Redux Toolkit store and slice logic
- `theme/` – shared palette and color-scheme hook

## ✅ Requirements coverage

- List users, search, detail routing, add/update/delete, and Redux integration are all implemented in JSX with a pixel-perfect UI

## 📚 Additional tooling

- `npm run lint` leverages Expo’s ESLint setup for consistent code quality

Feel free to fork, extend, or connect to a real backend. Enjoy building!
