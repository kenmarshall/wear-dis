---
doc: spec
status: approved
---

# Outfit Advisor (working name) — Technical Spec

## How This Works, In Plain Language
The advisor is a **Next.js** web app that runs on your laptop. Next.js is React plus TypeScript, with a small server built in. It has three pieces:

1. **The page.** One screen in your browser that moves through four steps: start, follow-ups, loading, results. It's built from React components, just like React Native, but rendered as web elements and styled with CSS. It remembers your answers only while the tab is open.
2. **Two API routes.** These are small server files in the same project. They hold your secret Anthropic API key, so it never reaches the browser. The first route asks Claude for follow-up questions about your event. The second asks Claude for about five ranked outfits. Each time, Claude has to answer in a fixed **JSON** shape (structured data), and our code checks that shape before the page uses it.
3. **The Amazon link builder.** A small function in our own code that turns each outfit piece into an Amazon search link, e.g. `amazon.com/s?k=navy+slim+fit+blazer+men`. The AI doesn't make links, so links are free, instant, and never broken.

Why this shape: it's one project with one command to run, two AI calls per session, no database, and no accounts. That's the smallest system that proves the kernel: ranked outfits with a convincing "why."

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **You open `localhost:3000`.** The page shows the **Start step**: a text box plus the event category chips from `lib/categories.ts`.
2. **You type "romantic date with my wife, fine dining" and submit, or tap a category.** The page sends `{ event }` to `POST /api/questions`.
3. **The questions route** asks Claude to judge whether the input is a dressable event and, if so, write 2–4 event-specific questions with tap options. Claude returns JSON in the `QuestionsResponse` shape. The route validates it and sends it back.
   - If the input isn't usable (e.g. "asdf"), the page stays on Start and shows Claude's friendly guidance plus an example.
4. **The page shows the Follow-up step.** There's one fixed "about you" question (Men's / Women's clothing), always asked first, followed by Claude's event questions. You tap an answer for each.
5. **You press "Find my outfits."** The page shows the **Loading step** and sends `{ event, gender, answers }` to `POST /api/outfits`.
6. **The outfits route** asks Claude for exactly five ranked outfits in the `OutfitsResponse` shape, validates the result, and returns it.
7. **The page shows the Results step.** It lists five cards, best first. Each card shows every piece with a color swatch. Tapping a card expands it in place to show the "why" and, for each piece, a link built by `lib/amazon.ts` from the piece's color, search terms, and your men's/women's answer.
8. **You click a link.** Amazon search results open in a new tab. "Start over" resets the page to Start.

## Stack
- **Next.js (App Router) + React + TypeScript (strict).** You chose it because it's familiar from React Native. The tradeoff you accepted is a small learning curve: folder-based routing, and CSS instead of `StyleSheet`. Use the current stable version from `create-next-app`. Docs: https://nextjs.org/docs
- **`@anthropic-ai/sdk`:** the official Anthropic TypeScript SDK. Docs: https://docs.claude.com/en/api/client-sdks
- **Claude Opus 5.5 (`claude-opus-5-5`).** You chose it for the best taste and reasoning on the kernel. The tradeoff you accepted is about 7¢ per session and a slower outfit step. Docs: https://docs.claude.com/en/docs/about-claude/models
- **`zod`:** defines the JSON shapes Claude must return. It's used with the SDK's structured-outputs helper (`zodOutputFormat` + `client.messages.parse`), which enforces and parses the shape. Docs: https://zod.dev and https://docs.claude.com/en/docs/build-with-claude/structured-outputs
- **CSS Modules + CSS variables** for styling, with design tokens in one file. Docs: https://nextjs.org/docs/app/getting-started/css
- **`next/font/google`** for self-hosted fashion typography. Docs: https://nextjs.org/docs/app/getting-started/fonts
- **Vitest** for unit tests on the link builder and the schemas. Docs: https://vitest.dev
- **Node.js 20+** is required by current Next.js. Check `node -v` in build step 1.

Not verified yet, check early in the build: the exact current Next.js major version and any breaking App Router changes, and whether `client.messages.parse` accepts the `fallbacks` option (see Claude Client).

## Where It Runs and How Someone Tries It
- **Runtime:** local only, by your choice, so your API key isn't paying for strangers' sessions. A Node.js dev server runs on your laptop, and you open it in a browser.
- **Requirements:** Node.js 20+, and an Anthropic API key in `.env.local` as `ANTHROPIC_API_KEY=...`. `.env.local` is gitignored. `.env.example` is committed with a blank value. Never paste the key into chat.
- **Start:** `npm install`, then `npm run dev`, then open http://localhost:3000.
- **Demo recording (for `6-ship`):** record the screen while you:
  1. Type the fine-dining date.
  2. Pick Men's or Women's and answer the follow-ups.
  3. Let the loading animation play.
  4. Show the five ranked cards.
  5. Expand the top card.
  6. Click one Amazon link.
- **Submission:** a short demo video plus a public GitHub repo. No deployment is planned. If you change your mind, Vercel is the natural target, with an overuse guard added first.

## Look and Feel
Carried forward from `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.
- **Palette:** near-white warm background, near-black ink, one muted accent (deep burgundy) for buttons and focus states. The outfit color swatches are the only bold color on screen. All of these are CSS variables in `app/tokens.css`. No hex values appear in components.
- **Typography:** an editorial high-fashion serif for headings and outfit names, with a clean sans-serif for body and controls. The goal is to feel like walking into a fashion store. Pick: **Bodoni Moda** for display and **Inter** for body, via `next/font/google`. These are my picks within your direction, so swap them freely.
- **Density:** spacious and calm, with generous white space, a single centered column (~640px max), and large tap targets (at least 44px).
- **Copy tone:** a reassuring, knowledgeable friend. "Here's why this works," not catalog-speak. All text lives in `lib/strings.ts`.
- **Motion:** only the loading animation, a subtle pulsing or shimmering element, plus a gentle expand on cards.

## Components

### Flow Controller (`app/page.tsx`)
A client component that owns the current step and all session data (see Data Model). It renders one step component at a time, calls the API routes through `lib/api.ts`, and uses an "in flight" guard so double-taps don't send two requests.
PRD ref: `prd.md > The Core Journey`, `prd.md > Screens and Layout`.

### EventInput (`components/EventInput.tsx`)
A text box, a submit button (disabled while empty or in flight), and category chips. Tapping a chip submits that category's label as the event text. It shows the unusable-input guidance inline when present.
PRD ref: `prd.md > Event Input`, `prd.md > States and Boundaries` (unusable input).

### FollowUpQuestions (`components/FollowUpQuestions.tsx`)
Renders the fixed "about you" question first, then Claude's questions. Each question is a row of selectable option chips. "Find my outfits" stays disabled until every question has an answer. A "Back" link returns to Start.
PRD ref: `prd.md > Follow-Up Questions`.

### LoadingState (`components/LoadingState.tsx`)
A centered animation in the accent color, with a short reassuring line ("Putting your looks together…"). It's used while either API call is in flight.
PRD ref: `prd.md > States and Boundaries` (loading).

### OutfitList and OutfitCard (`components/OutfitList.tsx`, `components/OutfitCard.tsx`)
The list renders five cards in rank order, with only one expanded at a time. Collapsed, a card shows the rank badge ("Best pick" for #1), the outfit name, a one-line summary, and every piece as a `PieceIllustration` (a small inline SVG for its slot, or accessory type, filled with `colorHex`) with its color name. Expanded, it adds the full "why it works" (occasion + colors) and an Amazon link per piece (opens in a new tab). "Start over" sits below the list.
PRD ref: `prd.md > Ranked Outfit Results`, `prd.md > Outfit Detail and Shopping Links`.

### ErrorMessage (`components/ErrorMessage.tsx`)
A friendly failure message plus a "Try again" button that repeats the last request.
PRD ref: `prd.md > States and Boundaries` (failure).

### Questions Route (`app/api/questions/route.ts`)
`POST { event: string }`. It trims and length-checks the input (1–300 characters), calls `getQuestions()` in `lib/claude.ts`, and returns a `QuestionsResponse`. It returns HTTP 500 with `{ error }` if Claude fails, refuses, or returns an invalid shape.
PRD ref: `prd.md > Event Input`, `prd.md > Follow-Up Questions`.

### Outfits Route (`app/api/outfits/route.ts`)
`POST { event, gender, answers: { question, answer }[] }`. It calls `getOutfits()` and returns an `OutfitsResponse`, sorted by `rank` on the server so the order is guaranteed. Errors work the same way as the questions route.
PRD ref: `prd.md > Ranked Outfit Results`.

### Claude Client and Prompts (`lib/claude.ts`, `lib/prompts.ts`)
Server-only code. It creates one `Anthropic` client (reads `ANTHROPIC_API_KEY`) and exposes two functions:
- `getQuestions(event)`: calls `client.messages.parse` with `model: "claude-opus-5-5"`, `max_tokens: 16000`, `output_config: { effort: "low", format: zodOutputFormat(QuestionsSchema) }`. Effort is low because this is a simple, fast step.
- `getOutfits(input)`: same call with `effort: "medium"` and `OutfitsSchema`. The prompt asks for exactly 5 outfits, ranked, each with a "why" covering the occasion and the color harmony, aimed at someone who doesn't know fashion.
- Both check `stop_reason === "refusal"` and a null `parsed_output`, and treat either as a failure.
- **Refusal fallback:** I'm enabling Anthropic's server-side fallback (`betas: ["server-side-fallback-2026-07-01"]`, `fallbacks: "default"`) so a rare safety-classifier refusal on a harmless request retries on another model. It needs verifying in build step 2 that this works with `messages.parse`. If it doesn't, drop it and treat a refusal as a normal failure.
- Thinking is adaptive by default on Opus 5.5, so it isn't configured.
PRD ref: `prd.md > Follow-Up Questions`, `prd.md > Ranked Outfit Results`.

### Amazon Link Builder (`lib/amazon.ts`)
`buildAmazonSearchUrl(piece, gender)` returns `https://www.amazon.com/s?k=` + URL-encoded `"{colorName} {searchTerms} {men's|women's}"`. It's a pure function, unit-tested, with no network calls.
PRD ref: `prd.md > Outfit Detail and Shopping Links`.

## Data Model
Shapes live in `lib/schemas.ts` as zod schemas, and TypeScript types are inferred from them.

```ts
Question        { id: string; text: string; options: string[] }        // 2–5 options
QuestionsResponse {
  usable: boolean;                // false for "asdf", "my cat", etc.
  guidance: string | null;        // friendly retry message when !usable
  exampleEvent: string | null;    // example of a better input when !usable
  questions: Question[];          // 2–4 event questions when usable; [] otherwise
}
Piece           { slot: "top" | "bottom" | "dress" | "outerwear" | "footwear" | "accessory";
                  name: string;          // "Slim-fit wool blazer"
                  colorName: string;     // "Navy"
                  colorHex: string;      // "#1F2A44" — data, rendered as the swatch
                  searchTerms: string }  // "slim fit wool blazer"
Outfit          { rank: number; name: string; summary: string;
                  whyOccasion: string; whyColors: string; pieces: Piece[] }
OutfitsResponse { outfits: Outfit[] }   // exactly 5
```

The fixed "about you" question (`gender: "men" | "women"`) is defined in code, not by Claude, so the link builder always gets a reliable value.

**Where data lives:**
- All session data is React state in the Flow Controller: `step`, `event`, `questions`, `gender`, `answers`, `outfits`, `expandedIndex`, `error`, `isLoading`.
- Updates happen through user taps and API responses.
- **Leave and come back:** everything is gone, and you start fresh at Start. This matches `prd.md > States and Boundaries` (persistence). Nothing is written to disk, browser storage, or a database.
- Event categories are a static list in `lib/categories.ts`.

## File Structure

```
outfit-advisor/            # project root (this folder)
├── app/
│   ├── layout.tsx         # fonts (next/font), tokens.css import, <html> shell
│   ├── tokens.css         # design tokens: colors, spacing, radii, font sizes (CSS variables)
│   ├── globals.css        # base element styles using tokens
│   ├── page.tsx           # Flow Controller: step state, API calls, renders steps
│   ├── page.module.css
│   └── api/
│       ├── questions/route.ts   # POST: event → follow-up questions (Claude)
│       └── outfits/route.ts     # POST: event + answers → 5 ranked outfits (Claude)
├── components/
│   ├── EventInput.tsx (+ .module.css)
│   ├── FollowUpQuestions.tsx (+ .module.css)
│   ├── LoadingState.tsx (+ .module.css)
│   ├── OutfitList.tsx (+ .module.css)
│   ├── OutfitCard.tsx (+ .module.css)
│   ├── PieceIllustration.tsx   # inline SVG clothing icons tinted to the piece color
│   └── ErrorMessage.tsx (+ .module.css)
├── lib/
│   ├── schemas.ts         # zod schemas + inferred types (shared by routes and page)
│   ├── claude.ts          # server-only: Anthropic client, getQuestions, getOutfits
│   ├── prompts.ts         # system prompts for both calls
│   ├── amazon.ts          # buildAmazonSearchUrl (pure)
│   ├── api.ts             # browser-side fetch helpers for the two routes
│   ├── categories.ts      # static event categories
│   └── strings.ts         # all user-facing text and accessibility labels
├── tests/
│   ├── amazon.test.ts
│   └── schemas.test.ts
├── .env.example           # ANTHROPIC_API_KEY=
├── .gitignore             # already ignores .env*, devpost/learner-profile.md
├── package.json
├── tsconfig.json          # strict
├── vitest.config.mts
├── README.md              # what it is, how to run, demo steps
└── devpost/               # Devpost learning workspace (planning docs)
```

## External Services and Dependencies

### Anthropic Messages API
- **Call:** `POST https://api.anthropic.com/v1/messages`, made through `client.messages.parse(...)` from `@anthropic-ai/sdk`.
- **Payload:** `model: "claude-opus-5-5"`, `max_tokens: 16000`, `system` (from `lib/prompts.ts`), `messages: [{ role: "user", content: <event + answers as text> }]`, and `output_config: { effort, format: zodOutputFormat(Schema) }`.
- **Response:** `response.parsed_output` is typed to the schema, or null if parsing failed. Check `response.stop_reason` too.
- **Auth:** `ANTHROPIC_API_KEY` from `.env.local`, read automatically by the SDK.
- **Cost:** $4 per 1M input tokens and $20 per 1M output tokens. That's an estimated ~2¢ for the questions call and ~5¢ for outfits, about **7¢ per session**. Thinking tokens are billed as output, so the real number may be somewhat higher. Development might total around $1–3.
- **Rate limits:** depend on your account tier, but aren't a concern at demo volume. The SDK retries 429 and 5xx errors twice automatically.
- Docs: https://docs.claude.com/en/api/messages and https://docs.claude.com/en/docs/build-with-claude/structured-outputs

### Amazon
There's no API call. The app only builds `https://www.amazon.com/s?k=...` search URLs. There's no key, cost, or rate limit.

### Google Fonts (via `next/font`)
Fonts are downloaded at build or dev time and self-hosted, with no runtime calls from the browser.

## Important Failure Modes
- **The outfit call is slow (15–30s+ on Opus).** The loading animation and reassuring copy cover it. The SDK default timeout is 10 minutes, so it won't time out.
- **Claude fails, refuses, or returns an invalid shape.** The route returns 500, and the page shows ErrorMessage with "Try again." Your answers are kept, so the retry doesn't make you re-answer.
- **Unusable input ("asdf", "my cat").** It isn't an error. The questions route returns `usable: false`, and Start shows the guidance plus an example event.
- **Missing API key.** The route returns an error, and the page shows the same friendly failure. The server log says which env var is missing.

## What Was Simplified and Why
- **Amazon search links** instead of exact products through Amazon's API. The API requires an affiliate account with sales history (`scope.md > Explicitly Cut`). The fuller version would need approval plus product lookups.
- **Color swatches** instead of outfit images. It's cheaper and faster, and swatches won't contradict the links (`scope.md > Explicitly Cut`).
- **No storage at all.** "About you" is asked every time (`prd.md > Deferred From the POC`). Saving it later would only need browser `localStorage`, still with no accounts.
- **A fixed men's/women's question in code** instead of letting Claude decide whether to ask it. The link builder must always have this value.
- **Local only, no deployment.** This avoids paying for others' usage. Deploying later would need Vercel plus an overuse guard.

## Decisions and Open Issues

**Your decisions:**
- **Next.js over Expo for web:** it's familiar React with a built-in server for the secret key. You accepted the small Next.js learning curve.
- **Anthropic Claude, model Opus 5.5:** the best taste and reasoning for the kernel. You accepted ~7¢ per session and a slower outfit step over Sonnet 5.5's lower cost and faster speed.
- **Local only:** "since it cost, maybe just locally for now."

**Implementation details I derived (change any you like):**
- Two API routes (questions, then outfits), not one.
- Structured outputs with zod schemas.
- Effort `low` for questions and `medium` for outfits.
- Server-side refusal fallback enabled.
- CSS Modules + token file; Bodoni Moda + Inter.
- Category list: Date night, Concert, Wedding guest, Work event, Party, Casual outing. This resolves the PRD assumption.
- Vitest for the link builder and schemas.

**Learner uncertainty:** none identified. Asked "which part are you least sure about?", you said "I think I understand everything."

**Build-time checks (agent uncertainty, to confirm early):**
1. Actual Opus 5.5 response time for the outfit call. If it's far beyond 30s, revisit the effort level with you before changing the model.
2. Whether the Amazon search links land on relevant, correctly colored results for a few sample pieces.
3. The current Next.js version, and `fallbacks` compatibility with `messages.parse`.

**Carried from `prd.md > Open Questions`:** the project name is still a working name. It doesn't block the build and can be decided before `6-ship`.
