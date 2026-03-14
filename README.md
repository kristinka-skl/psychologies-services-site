# Psychologists Services

A portfolio/demo web app for finding psychologists, exploring profiles, and
booking personal consultations.

Built with Next.js and Firebase, with a responsive UI focused on clean UX and
accessibility.

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Firebase Auth + Realtime Database (SDK + REST API wrapper)
- TanStack Query 5, Zustand
- react-hook-form + Yup
- CSS Modules + CSS variables

## Key Features

- Psychologists directory with sorting and progressive loading
- Authentication (sign up / sign in) and protected favorites
- Appointment request modal with validation and time picker
- Server prefetch + client hydration for fast page rendering

## Run Locally

```bash
npm install
npm run dev
```

Requires Firebase public env variables (`NEXT_PUBLIC_FIREBASE_*`) and
`NEXT_PUBLIC_SITE_URL`.

