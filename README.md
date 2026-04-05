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

## Getting started

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` to `.env` and set the values:

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous (public) key |
| `NEXT_PUBLIC_SITE_URL` | Site origin (e.g. `http://localhost:3000` in development) |
| `GEMINI_API_KEY` | Google AI / Gemini API key (validated in `src/env.js`; used by the summarize API) |

When you add or rename environment variables, update the schema in `src/env.js` as well.

3. Start the dev server:

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

Deploy on [Vercel](https://vercel.com) or any host that supports Next.js. Set the same environment variables in your hosting provider’s dashboard.

## License

This project is released under the [MIT License](LICENSE).
