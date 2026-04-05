# EventHub — Frontend

> Modern, dark-luxury Event Management web application built with React 18, Vite, Tailwind CSS, TanStack React Query, and Framer Motion.

**Live App:** https://event-managementfrontend.netlify.app  
**Backend API:** https://event-backend-production-06c4.up.railway.app/api  
**API Docs:** https://event-backend-production-06c4.up.railway.app/api/swagger-ui.html

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| UI Components | Radix UI primitives |
| Animations | Framer Motion 11 |
| Data Fetching | TanStack React Query v5 |
| Form Handling | React Hook Form + Zod |
| HTTP Client | Axios (with interceptors) |
| Notifications | Sonner |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router DOM v6 |
| Deployment | Netlify |

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axiosInstance.js      # Axios + JWT refresh interceptor
│   │   └── index.js              # All API modules + React Query keys
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── events/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventForm.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   └── ui/
│   │       ├── index.jsx         # Button, Input, Badge, Modal, StatCard, etc.
│   │       └── Pagination.jsx
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state
│   ├── lib/
│   │   ├── schemas.js            # Zod validation schemas
│   │   └── utils.js              # cn(), formatters, constants
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── EventFormPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EventDetail.jsx
│   │   ├── Events.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   └── Register.jsx
│   ├── App.jsx                   # Router + providers
│   ├── index.css                 # Global styles + Tailwind
│   └── main.jsx                  # Entry point + React Query setup
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── .env
```

---

## Features

### User Features
- **Browse Events** — paginated grid of all upcoming events with category badges, occupancy bars, and speaker previews
- **Search & Filter** — real-time search by keyword, filter by category and location
- **Event Detail** — full event page with description, speakers (bio, LinkedIn, website), date, venue, and live slot counter
- **Register for Events** — one-click registration with email confirmation
- **Cancel Registration** — cancel from the event page or from the dashboard
- **My Dashboard** — view all registrations with status (REGISTERED / ATTENDED / CANCELLED / NO_SHOW), stats cards
- **JWT Auth** — login / register with access + refresh token management; automatic token refresh on expiry

### Admin Features
- **Admin Panel** — tabbed interface with Overview, Events, and Users tabs
- **Dashboard Stats** — bar chart showing total events, users, registrations, and upcoming events
- **Event Management** — create, edit, soft-delete events with full form validation
- **Speaker Management** — multi-select speaker assignment during event creation/edit
- **User Management** — enable/disable users, promote to Admin
- **Attendance Tracking** — mark attendees as ATTENDED, NO_SHOW from admin panel

### Design
- **Dark luxury theme** — deep obsidian blacks with gold/amber accents
- **Cormorant Garamond** display font + **Cabinet Grotesk** body font
- **Grain texture** background for depth
- **Framer Motion** — spring animations on page load, card hovers, staggered list reveals, modal transitions
- **Fully responsive** — mobile hamburger menu, responsive grids

---

## Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Events listing (same as `/events`) |
| `/events` | Public | Browse all events with search |
| `/events/:id` | Public | Event detail + registration |
| `/login` | Guest only | Login page |
| `/register` | Guest only | Registration page |
| `/dashboard` | Logged in | User's registrations + stats |
| `/admin` | Admin only | Admin panel (stats, events, users) |
| `/admin/events/new` | Admin only | Create new event |
| `/admin/events/:id/edit` | Admin only | Edit existing event |
| `*` | Public | 404 Not Found page |

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone the repo
```bash
git clone https://github.com/your-username/event-management-frontend.git
cd event-management-frontend
```

### 2. Create `.env` file
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=EventHub
VITE_APP_VERSION=2.0.0
```

> To point at the live backend instead:
> ```env
> VITE_API_BASE_URL=https://event-backend-production-06c4.up.railway.app/api
> ```

### 3. Install dependencies
```bash
npm install
```

### 4. Start dev server
```bash
npm run dev
```

App available at: `http://localhost:5173`

---

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Deployment (Netlify)

This project is deployed on **Netlify** with automatic deploys on every push to `main`.

### Manual deploy steps:
1. Push to GitHub
2. New site on Netlify → Import from GitHub
3. **Build command:** `npm run build`
4. **Publish directory:** `dist`
5. Set environment variable:
   - `VITE_API_BASE_URL` = `https://event-backend-production-06c4.up.railway.app/api`

### Fix client-side routing on Netlify

Create a `public/_redirects` file with:
```
/*    /index.html    200
```

This ensures React Router works correctly on direct URL access and page refresh.

**Live Frontend:** https://event-managementfrontend.netlify.app

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL |
| `VITE_APP_NAME` | No | App name (default: `EventHub`) |
| `VITE_APP_VERSION` | No | App version string |

> All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

---

## Key Implementation Details

### JWT Token Management
Tokens are stored in `localStorage`. The Axios instance handles:
- Attaching `Authorization: Bearer <token>` to every request automatically
- Detecting `401` responses and attempting a silent refresh using the refresh token
- Queuing concurrent requests while refresh is in progress (no duplicate refresh calls)
- Logging out and redirecting to `/login` if refresh fails

### React Query Caching
All server data is managed by TanStack React Query with:
- `staleTime: 60_000` — data stays fresh for 1 minute before background refetch
- `keepPreviousData: true` — pagination doesn't flash blank between pages
- Query key factory in `src/api/index.js` — single source of truth for cache invalidation
- Cache is cleared on logout via `queryClient.clear()`

### Form Validation
React Hook Form + Zod schemas in `src/lib/schemas.js`:
- `loginSchema` — email + password required
- `registerSchema` — name, email, password (min 8, uppercase, number), optional phone
- `createEventSchema` — all fields + `@Future` check on start date
- `updateEventSchema` — same but no `@Future` (edit of existing events)
- `speakerSchema` — name, email, optional bio/social links

---

## Screenshots

| Page | Description |
|---|---|
| Events Listing | Dark card grid with gold category badges and occupancy bars |
| Event Detail | Hero image, speaker cards, sticky registration sidebar |
| Login / Register | Centered card with gold logo mark and animated entrance |
| User Dashboard | Stats cards + registration table with cancel action |
| Admin Panel | Tabbed layout with bar chart and full management tables |

---

## Related Repository

- **Backend:** https://github.com/your-username/event-management-backend

---

