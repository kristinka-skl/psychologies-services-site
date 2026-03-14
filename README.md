# Psychologists Services

A portfolio/demo web app for finding psychologists, exploring profiles, and
booking personal consultations.

Built with modern Next.js architecture, Firebase backend services, and a
responsive UI focused on clean UX and accessibility.

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Firebase Auth + Realtime Database
- TanStack Query 5 (prefetch + hydration)
- Zustand (auth/favorites state)
- react-hook-form + Yup (form validation)
- CSS Modules + CSS variables

## Key Features

- Landing page with a clear value proposition and CTA
- Psychologists directory with sorting and progressive loading
- Authentication flows (sign up / sign in) with validated forms
- Favorites list for authorized users only
- Appointment request modal with date/time picker
- Loading, error, and not-found states for better UX

## Implementation Highlights

- Server-side prefetch + client hydration for psychologists pages
- Firebase data access wrapped in reusable API/query layers
- Optimistic favorites updates with rollback on request failure
- Reusable accessible modal with portal, focus handling, and Escape close

## Run Locally

```bash
npm install
npm run dev
```

Additional scripts:

```bash
npm run build
npm run start
npm run lint
```

Requires Firebase public env variables (`NEXT_PUBLIC_FIREBASE_*`) and
`NEXT_PUBLIC_SITE_URL` (used for metadata/Open Graph).

## SVG Sprite Notes

- Store icon symbols in `public/sprite.svg` as `<symbol id="icon-name">`
- Use icons as `<use href="/sprite.svg#icon-name" />`
- Keep monochrome icon colors as `currentColor`
