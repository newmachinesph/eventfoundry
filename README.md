# Event Foundry

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Event Foundry is a prototype event-sourcing web app for planners in Singapore. A short
wizard collects the event type, guest count, date, budget and venue/vendor preferences,
then a Next.js API route queries a Supabase catalogue of venues and vendors, scores each
candidate, and shows the best matches on a recommendation page. It is built with
Next.js (App Router), React, TypeScript, Tailwind CSS and Supabase (Postgres, Auth,
pgvector).

> Prototype status: the catalogue comes from a seed script, and the testimonials and
> past-event case studies in the UI are sample content.

## Features

- **Sourcing wizard** (`/source`): pick venue only, vendors only, or a full package, then
  event details and preferences (3 or 4 steps). Signed-out users are sent to sign in
  before seeing results.
- **Matching API** (`POST /api/match`): filters venues by region, budget and capacity and
  vendors by category and per-vendor budget, then ranks them with a rule-based 50-99
  match score (rating, featured flag, type/location/category overlap). Returns up to 8 of each.
- **Recommendations** (`/recommendation`): result cards with sort options, a compare
  view and an availability calendar. Results are passed from the wizard via
  `sessionStorage`.
- **Catalogue** (`/brands`): browse all venues and vendors from Supabase, paginated.
- **Past events** (`/past-events`): filterable gallery of sample event case studies.
- **Auth** (`/login`, `/signup`): Supabase email/password sign-in.
- **Database** (`docs/schema.sql`): venues, vendors, event briefs, shortlists, a budget
  summary view, row-level security policies, HNSW vector indexes and `match_venues` /
  `match_vendors` similarity functions. The seed script writes OpenAI embeddings; the
  current `/api/match` route does not use vector search yet.

## Getting started

Requirements: Node.js 20+, a Supabase project, and (for seeding) Python 3 and an OpenAI
API key.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the database: run `docs/schema.sql` in the Supabase SQL editor (it enables the
   `vector` extension).

3. Create `.env.local` in the project root:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
   ```

   The app only uses the anon key; reads go through the public-read RLS policies.

4. Seed 50 venues and 50 vendors (with embeddings). Create a `.env` with
   `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (service role, needed to bypass RLS) and
   `OPENAI_API_KEY`, then:

   ```bash
   pip install -r scripts/requirements.txt
   python scripts/seed.py
   ```

5. Start the dev server and open [http://localhost:3000](http://localhost:3000):

   ```bash
   npm run dev
   ```

## Scripts

| Command         | What it does                 |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the Next.js dev server |
| `npm run build` | Production build             |
| `npm run start` | Serve the production build   |
| `npm run lint`  | Run ESLint                   |

There is no test suite yet.

## Project structure

```
src/
  app/
    page.tsx               Landing page
    source/                Sourcing wizard
    recommendation/        Match results, compare view, calendar
    brands/                Venue and vendor catalogue
    past-events/           Sample event case studies
    login/, signup/        Supabase auth pages
    api/match/route.ts     Matching and scoring endpoint
  components/              Navbar, Footer, Logo, TestimonialCarousel, ChatWidget
  lib/supabase.ts          Browser Supabase client
docs/schema.sql            Postgres schema, RLS policies, vector functions
scripts/seed.py            Seeds venues/vendors with OpenAI embeddings
```

## Deployment

Any Next.js host works (for example Vercel). Set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` in the host's environment.

## License

The code is released under the [MIT License](LICENSE). The MIT license covers the code;
the Event Foundry name and logo identify the project.
