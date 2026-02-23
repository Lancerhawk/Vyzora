# Vyzora — Frontend

[![Version](https://img.shields.io/badge/version-v0.5.0-purple)](package.json)

The Next.js 16 App Router frontend for Vyzora. Serves both the public-facing marketing site (homepage, docs) and the authenticated analytics dashboard.

---

## What's in here

| Route | Description |
|---|---|
| `/` | Homepage — SDK overview, features, architecture, code preview |
| `/docs` | SDK documentation (17 sections, mobile responsive) |
| `/login` | GitHub OAuth entry point |
| `/dashboard` | Project list (authenticated) |
| `/dashboard/[projectId]` | Analytics dashboard — pageviews, sessions, events, trends |

---

## Key Components

| Component | Description |
|---|---|
| `Navbar.tsx` | Sticky navbar with scroll-triggered border, auth-aware |
| `ChangelogButton.tsx` | Floating changelog modal with version history (mobile responsive) |
| `DocsSidebar.tsx` | Scrollspy sidebar with IntersectionObserver active section highlight |
| `ParticleField.tsx` | Animated hero background |
| `dashboard/MetricCard.tsx` | Stat tile for pageviews, sessions, etc. |
| `dashboard/TrendChart.tsx` | Daily trend bar chart (Recharts) |
| `dashboard/EventTable.tsx` | Top events table |

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Data fetching**: React Query (`@tanstack/react-query`)
- **Charts**: Recharts
- **Auth**: JWT-based session (HttpOnly cookie set by backend)

---

## Development

```bash
# From monorepo root
npm run dev:frontend

# Or from this directory
npm run dev
# → http://localhost:3000
```

### Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Build

```bash
npm run build
npm run start
```

---

## Linting

```bash
npm run lint
```

---

See the [root README](../README.md) for full monorepo setup and architecture documentation.
