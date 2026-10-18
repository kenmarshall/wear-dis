# Wear Dis

A personal fashion advisor for people who don't know how to dress for an occasion. Describe your event (or tap a category), answer a few quick questions, and get **five complete outfits ranked best-first**. Each one explains *why* it works for the occasion and why the colors go together. Every piece links to Amazon search results in its color.

Built for Devpost Learn's *Build With AI: Basics* hackathon as a proof of concept. Planning docs are in [`devpost/`](devpost/): scope, PRD, spec, and the build checklist.

## How it works

- **Next.js (App Router) + React + TypeScript.** One page moves through the steps: occasion → follow-up questions → loading → ranked results.
- **Two API routes** (`app/api/questions`, `app/api/outfits`) hold the Anthropic API key on the server. They ask **Claude Opus 5.5** for structured JSON validated with zod.
- **Amazon links are built in code** (`lib/amazon.ts`) as search URLs like `amazon.com/s?k=Navy+slim+fit+wool+blazer+men's`. There's no product API.
- **Nothing is stored.** Close the tab and it starts fresh.

## Run it locally

Requires Node.js 20+ and an [Anthropic API key](https://console.anthropic.com/) with credits. Each full session costs roughly 7¢.

```bash
npm install
cp .env.example .env.local   # then put your key after ANTHROPIC_API_KEY=
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run typecheck
npm test
npm run build
```

## Demo walkthrough

1. Type "romantic dinner date at a fine-dining restaurant" and press **Continue**.
2. Pick **Men's** or **Women's** and answer the follow-up questions, then press **Find my outfits**.
3. Wait about 30 seconds while the loading animation runs.
4. Browse the five ranked looks and tap **See why it works & shop** on the best pick.
5. Click **Shop on Amazon** on a piece.

## Not in this proof of concept

Real product photos, AI images of you in the outfit, using your own wardrobe, saved preferences, and prices. See `devpost/prd.md` for the full list.
