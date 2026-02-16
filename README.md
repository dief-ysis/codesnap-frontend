# CodeSnap Frontend

Modern web client for CodeSnap, a code snippet sharing platform built with Next.js, React, and TypeScript.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS v4
- **i18n:** next-intl v4 (English / Spanish)
- **Theme:** next-themes (dark / light)
- **Animations:** Motion (framer-motion)
- **Validation:** Zod 4
- **Icons:** Lucide React

## Project Structure

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx              # Root locale layout with providers
│       ├── page.tsx                # Landing page
│       ├── auth/
│       │   ├── login/page.tsx      # Login page
│       │   └── register/page.tsx   # Registration page
│       ├── dashboard/page.tsx      # User dashboard
│       ├── explore/page.tsx        # Browse public snippets
│       ├── snippets/
│       │   ├── new/page.tsx        # Create snippet
│       │   └── [id]/page.tsx       # Snippet detail/edit
│       ├── s/[slug]/page.tsx       # Shared snippet (public link)
│       └── collections/
│           ├── page.tsx            # Collections list
│           └── [id]/page.tsx       # Collection detail
├── components/
│   ├── editor/                     # Code editor and language selector
│   ├── layout/                     # Header, Footer, LanguageSwitcher
│   ├── providers/                  # Auth, Theme, Motion providers
│   ├── snippets/                   # SnippetCard
│   └── ui/                         # Button, Input, ThemeToggle
├── hooks/                          # Custom React hooks
├── i18n/                           # Internationalization config
├── lib/                            # API client, auth helpers, utilities
└── middleware.ts                   # next-intl locale middleware
```

## Prerequisites

- Node.js 20+
- CodeSnap API running (default: `http://localhost:3001`)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/dief-ysis/codesnap-frontend.git
cd codesnap-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api/v1` |

## Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing / Home page | No |
| `/explore` | Browse and search public snippets | No |
| `/auth/login` | Login page | No |
| `/auth/register` | Registration page | No |
| `/dashboard` | User dashboard with owned snippets | Yes |
| `/snippets/new` | Create a new snippet | Yes |
| `/snippets/[id]` | View, edit, fork, or share a snippet | Mixed |
| `/s/[slug]` | Public shared snippet link | No |
| `/collections` | User collections list | Yes |
| `/collections/[id]` | Collection detail with snippets | Yes |

## Internationalization

The app supports **English** and **Spanish** via `next-intl`. Locale files are located in `messages/`:

- `messages/en.json` — English translations
- `messages/es.json` — Spanish translations

The locale is determined by the URL prefix (`/en/...` or `/es/...`).

## Theme

Dark and light mode are supported via `next-themes` with class-based toggling. The theme preference is persisted in `localStorage`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
