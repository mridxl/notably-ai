# Notably AI

A note-taking web app built with Next.js and Supabase, with optional AI-powered summarization using Google Gemini.

## Features

- **Authentication**: Sign up, sign in, and session handling via Supabase
- **Notes**: Create, view, edit, and organize notes (protected routes)
- **AI summarization**: Streamed summaries of note content (Gemini via the Vercel AI SDK)
- **Theming**: Light and dark mode
- **Responsive layout**: Usable on phones, tablets, and desktops

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [Supabase](https://supabase.com) (auth and database)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/) (UI primitives)
- [Vercel AI SDK](https://sdk.vercel.ai/docs) and [@ai-sdk/google](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai) (Gemini)

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS recommended)
- [pnpm](https://pnpm.io/) (see `packageManager` in `package.json` for the version used in this repo)
- A [Supabase](https://supabase.com) project (free tier is enough to start)
- A [Google Gemini](https://ai.google.dev/) API key for AI summaries (also required by `src/env.js` so the app can start)

## Setup

### Supabase

1. **Create a project** in the [Supabase dashboard](https://supabase.com/dashboard).
2. **API keys**: open **Project Settings → API** and copy the **Project URL** and the **anon public** key into your `.env` as `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. **Auth URLs**: open **Authentication → URL Configuration**.
  - Set **Site URL** to your app origin (for local dev: `http://localhost:3000`).
  - Under **Redirect URLs**, add:
    - `http://localhost:3000/auth/callback`
    - Your production URL as well, e.g. `https://your-domain.com/auth/callback`
   **Sign in with Google** uses `NEXT_PUBLIC_SITE_URL` as the OAuth return path (`/auth/callback`), handled in `src/app/(auth)/auth/callback/route.ts`, so these URLs must be listed in Supabase. See [this guide](https://supabase.com/docs/guides/auth/social-login/auth-google) for more details.
4. **Google sign-in (optional)**: in **Authentication → Providers**, enable **Google**. In the [Google Cloud Console](https://console.cloud.google.com/), create OAuth client credentials and set **Authorized redirect URIs** to the callback URL Supabase shows (typically `https://<project-ref>.supabase.co/auth/v1/callback`).
5. **Database**: open **SQL Editor** and run:

```sql
-- Notes table (matches src/lib/supabase/db.types.ts)
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  content text,
  summary text,
  embedding text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create policy "notes_select_own"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "notes_insert_own"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "notes_update_own"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "notes_delete_own"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Keep updated_at in sync when a note is edited (the app does not set this column in updates)
create or replace function public.set_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger notes_updated_at
  before update on public.notes
  for each row
  execute function public.set_notes_updated_at();
```

If your database rejects `execute function`, use `execute procedure public.set_notes_updated_at();` instead.

For quick local testing you can disable **Confirm email** under **Authentication → Providers → Email** so new accounts can sign in right away.

### Google Gemini (summaries)

Create an API key in [Google AI Studio](https://aistudio.google.com/apikey) and set `GEMINI_API_KEY` in `.env`. The summarize API route uses this key on the server only.

## Run locally

1. Clone the repository and install dependencies:

```bash
pnpm install
```

1. Copy `.env.example` to `.env` and set the values:


| Variable               | Description                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`         | Supabase project URL                                                                                 |
| `SUPABASE_ANON_KEY`    | Supabase anonymous (public) key                                                                      |
| `NEXT_PUBLIC_SITE_URL` | Same origin as in Supabase **Site URL** (e.g. `http://localhost:3000`) — used for OAuth `redirectTo` |
| `GEMINI_API_KEY`       | Google AI / Gemini API key (validated in `src/env.js`; used by the summarize API)                    |


When you add or rename environment variables, update the schema in `src/env.js` as well.

1. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

- `pnpm build` — production build  
- `pnpm start` — run the production server (after `pnpm build`)  
- `pnpm preview` — build then start locally  
- `pnpm check` — lint and TypeScript check  
- `pnpm lint` / `pnpm lint:fix` — ESLint  
- `pnpm format:check` / `pnpm format:write` — Prettier

## Project structure

- `src/app` — App Router routes and layouts
  - `(auth)` — login, register, auth callback
  - `(protected)` — authenticated area (notes)
    - `notes` — list, create, view, and edit flows
  - `api/summarize` — streaming summarization API route
- `src/components` — shared UI
- `src/lib` — helpers and integrations (including Supabase clients)
- `src/env.js` — validated environment variables

## Deployment

Deploy on [Vercel](https://vercel.com) or any host that supports Next.js. Set the same environment variables in your hosting provider’s dashboard (`NEXT_PUBLIC_SITE_URL` should be your public HTTPS origin). In the Supabase dashboard, update **Site URL** and **Redirect URLs** to match that production origin and `https://your-domain.com/auth/callback`.

## License

This project is released under the [MIT License](LICENSE).