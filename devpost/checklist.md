---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. You describe an event and see five ranked outfits with the "why"**
  Becomes usable: A running Next.js app at localhost:3000. Type an event, a loading animation plays, and five ranked outfit cards appear, best first. Each card shows every piece with a color swatch, plus the "why it works" (occasion + colors). It's already styled in the fashion-store look. No follow-ups or links yet.
  Why now: This is the unique kernel and the biggest risk in one slice. It proves Opus 5.5 returns valid structured outfits, measures how long that takes (build-time check 1), and confirms `fallbacks` with `messages.parse` (check 3). Bootstrapping is folded in here.
  PRD ref: `prd.md > Ranked Outfit Results`, `prd.md > The Core Journey` (steps 1, 4, 5), `prd.md > Look and Feel`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Look and Feel`, `spec.md > Data Model`, `spec.md > Outfits Route`, `spec.md > Claude Client and Prompts`, `spec.md > OutfitList and OutfitCard`, `spec.md > LoadingState`
  Build: Scaffold Next.js (TypeScript strict, App Router) in the project root. Install `@anthropic-ai/sdk`, `zod`, and `vitest`. Add `.env.example`, `tokens.css`, `globals.css`, fonts, and `strings.ts`. Write `schemas.ts` (Outfit, Piece, OutfitsResponse), `prompts.ts`, `claude.ts` (`getOutfits`), the `/api/outfits` route, and `lib/api.ts`. The page has a minimal event text box, then LoadingState, then OutfitList/OutfitCard (collapsed view plus the "why" visible for now). The outfits route accepts `answers` and `gender` as optional until slice 2.
  Verify (mechanical): `npx tsc --noEmit` passes. `npm test` (schemas test) passes. `npm run build` succeeds. With the dev server running, `curl -X POST localhost:3000/api/outfits` with the fine-dining date returns 5 outfits that validate against the schema, sorted by rank, and records the response time. Verify the page renders the results (browser check).
  Learner check: Run `npm run dev` and open http://localhost:3000. Type "romantic date with my wife at a fine-dining restaurant" and submit. Watch the loading animation, then read the five outfits. Do they make sense for the occasion, is the best one convincing, does the "why" give you confidence, and does it look like a fashion store?
  Commit: `Generate five ranked outfits with explanations from an event`

- [x] **2. The advisor asks tailored follow-ups first, and handles unusable input**
  Becomes usable: The Start step shows the text box and event category chips. Submitting shows the fixed Men's/Women's question plus Claude's 2–4 event-specific questions as tap options. The outfits then reflect your answers. Input like "asdf" keeps you on Start with friendly guidance and an example.
  Why now: Follow-ups shape the kernel's output, so they come right after outfit quality is confirmed. They also give the link builder its reliable men's/women's value for slice 3.
  PRD ref: `prd.md > Event Input`, `prd.md > Follow-Up Questions`, `prd.md > States and Boundaries` (unusable input)
  Spec ref: `spec.md > EventInput`, `spec.md > FollowUpQuestions`, `spec.md > Questions Route`, `spec.md > Claude Client and Prompts`, `spec.md > Data Model`, `spec.md > Flow Controller`
  Build: Add `categories.ts`, QuestionsSchema, `getQuestions`, and the `/api/questions` route (with input length check). Add the EventInput component (text box + chips + guidance) and the FollowUpQuestions component (fixed gender question first, chips, Find button disabled until all are answered, Back link). Make `gender` and `answers` required on the outfits route and include them in the outfits prompt. Turn the page into the full step-based Flow Controller with an in-flight guard.
  Verify (mechanical): `tsc` and `npm test` (schema tests for QuestionsResponse) pass. curl `/api/questions` with the date returns `usable: true` and 2–4 questions with options. With a concert it returns different questions. With "asdf" it returns `usable: false` with guidance and an example. curl `/api/outfits` with gender and answers returns 5 outfits. Browser check of the full flow.
  Learner check: Open the app. Try once by typing your date and once by tapping a category. Answer the follow-ups and confirm the outfits fit your answers. Then type "asdf" and see what it tells you. Do the questions feel like "just enough"?
  Commit: `Add event categories, tailored follow-up questions, and input guidance`

- [x] **3. Open an outfit to see why it works and shop every piece on Amazon**
  Becomes usable: Each piece is drawn as a clothing illustration tinted to its color. Cards are collapsed by default. Tapping one expands it in place (one at a time) to show the full "why" and an Amazon search link for every piece, using its color and your men's/women's answer. The link opens in a new tab. "Start over" returns to Start.
  Why now: This completes the core journey end to end, and it depends on slice 2's gender value.
  PRD ref: `prd.md > Outfit Detail and Shopping Links`, `prd.md > The Core Journey` (steps 6, 7)
  Spec ref: `spec.md > Amazon Link Builder`, `spec.md > OutfitList and OutfitCard`, `spec.md > Flow Controller`
  Build: Add `components/PieceIllustration.tsx` (inline SVGs per slot, plus a few accessory types picked from the piece name, filled with `colorHex`, outlined with an ink token) and use it in OutfitCard in place of the dot swatch. Write `lib/amazon.ts` (`buildAmazonSearchUrl`) with unit tests. Add expand/collapse state to OutfitList (`expandedIndex`) and the expanded content to OutfitCard (why + links with accessibility labels). Add a Start over action.
  Verify (mechanical): The illustration chooses the right icon for each slot and accessory keyword (unit test). `npm test` passes, including `amazon.test.ts` (encoding, color first, men's/women's suffix). `tsc` and `npm run build` pass. Open 3 generated links and confirm they land on relevant, correctly colored Amazon results (build-time check 2). Browser check of expand/collapse and Start over.
  Learner check: Run the whole journey. Tap the top outfit to expand it, read the "why," click two piece links, and check that Amazon shows something close, especially in color. Then press Start over.
  Commit: `Expand outfits to show reasoning and Amazon search links`

- [x] **4. Failures are friendly, and it's ready to demo**
  Becomes usable: If Claude fails, refuses, or the key is missing, you see a friendly message and "Try again," which keeps your answers. The look-and-feel polish is finished, and the README explains how to run it and record the demo.
  Why now: The happy path is complete, so this hardens the moments that would break the demo and closes out the remaining PRD states.
  PRD ref: `prd.md > States and Boundaries`, `prd.md > Look and Feel`
  Spec ref: `spec.md > ErrorMessage`, `spec.md > Important Failure Modes`, `spec.md > Look and Feel`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Add the ErrorMessage component and retry of the last request in the Flow Controller. Add error handling in both routes (missing key, refusal, null parse) returning 500 `{ error }`. Polish spacing, typography, and focus states, check touch targets of at least 44px and contrast, and write the README.
  Verify (mechanical): `tsc`, `npm test`, and `npm run build` pass. Starting the dev server without `ANTHROPIC_API_KEY` makes both routes return 500 `{ error }`, and the page shows ErrorMessage with Try again. Restoring the key and retrying works. Run `grep` for hardcoded hex values outside `tokens.css`.
  Learner check: Temporarily rename `.env.local`, restart, and try the journey to see the friendly error. Then restore it and press Try again. Walk the full demo once as if recording.
  Commit: `Add friendly failure states, polish, and README`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1 (outfit quality and look can still reshape prompts and styling)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions

- Outfit call measured at ~34s on Opus 5.5 (effort medium), slightly above the ~30s estimate; kept effort as planned and changed the loading copy to "about 30 seconds" — build-time check 1.
- Server-side `fallbacks: "default"` works with `client.beta.messages.parse` + `betaZodOutputFormat` (beta namespace, not `messages.parse`) — build-time check 3.
- Next.js scaffold is v16.4.2; Vitest config is `vitest.config.mts` (ESM) instead of `.ts` — the project isn't `type: module`.
- Slice 1 checkpoint: the learner liked the outfits but wanted to see each item, not just a color dot. They agreed to color-tinted clothing illustrations (no new service), folded into slice 3; the fallback is the current swatches. Product photos and AI images stay out of the PoC. Updated `prd.md > Look and Feel`/`Ranked Outfit Results`/`What We're Building`/`Non-Goals` and `spec.md > OutfitList and OutfitCard`/`File Structure`.
- Amazon returns a bot-challenge page to automated requests, so link relevance (build-time check 2) can't be checked mechanically. Unit tests cover the URL format, a browser check confirmed real link queries (e.g. "Navy unstructured blazer men's"), and result relevance moves to the learner's hands-on check.
- The browser check found the textarea didn't inherit the page font (it showed monospace). Fixed in `globals.css`.
- ErrorMessage got a secondary "Start over" next to "Try again". Restarting the dev server reloads the page, so Try again was verified by making the first outfits request fail in the browser: the retry resent identical answers and loaded 5 outfits.
