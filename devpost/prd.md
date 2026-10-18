---
doc: prd
status: approved
---

# Wear Dis — Product Requirements

A personal fashion advisor for someone who doesn't know styles or which colors go together. You describe an event, answer a few tailored questions, and get about five complete outfits, ranked best first. Each one explains why it works and links every piece to Amazon.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. **Start.** You open the advisor and see a text box asking about your event, with event categories you can tap underneath.
2. **Describe the event.** You either type it in your own words (e.g. "a romantic dinner date at a fine-dining restaurant") or tap the closest category, then submit.
3. **Answer follow-ups.** The advisor asks a few questions:
   - About you, every time: e.g. men's or women's clothing.
   - About the event, chosen by the advisor for that event type, each with tap-to-choose options.
4. **Wait briefly.** A loading animation plays while the advisor puts outfits together.
5. **See ranked outfits.** About five outfit cards appear, ordered from best recommendation to least. Each card shows every piece of the outfit at a glance.
6. **Open one.** Clicking a card expands it in place to show the full "why this works" explanation and an Amazon link for each piece.
7. **Shop.** Clicking a piece's link opens Amazon search results for that piece, close in style and especially color.

Success means you're confident about what to wear and know where to buy it.

## Screens and Layout
It's a single flow through four steps. Nothing persists between them except your answers so far.

- **Start step:** a text box asking about the event, with event category options below it.
- **Follow-up step:** the "about you" questions and the advisor's event-specific questions, each answered by tapping an option.
- **Loading step:** a loading animation.
- **Results step:** a vertical list of about five outfit cards, ranked. One card at a time can be expanded in place.

## Look and Feel
- Light and minimal, with lots of white space.
- Typography should "feel stylistic like going into a fashion store" and make you "feel like a fashion model." That suggests an elegant, editorial, high-fashion character, especially for headings.
- References: Pinterest outfit boards. The tone is a reassuring, knowledgeable friend, not a catalog (`scope.md > Inspiration & Identity`).
- Each piece is shown as a simple clothing illustration (shirt, trousers, shoe…) filled with the piece's color, plus its color name. These illustrations are the main splash of color; the surrounding UI stays quiet. (Added at the slice 1 checkpoint: the learner wanted to see each item, not just a color dot.)

## Features and Behavior

### Event Input
Source: `scope.md > The Core Loop`, step 1.
- As someone who doesn't know how to dress for an occasion, I want to describe it my way or pick a category, so that starting is easy either way.
  - [ ] The first screen shows a text box asking about the event, plus visible event categories.
  - [ ] Typing a free-form description and submitting moves on to the follow-ups.
  - [ ] Tapping a category moves on to the follow-ups (the category stands in for a typed description).
  - [ ] Varied phrasings of the same event (e.g. "fancy dinner date" and "romantic fine-dining date") are understood as that event.

### Follow-Up Questions
Source: `scope.md > The POC Boundary` ("a few clarifying questions").
Principle: ask "just enough" to make the suggestions really suitable, without burdening the user.
- As the user, I want the advisor to know what to ask, so that I don't need fashion knowledge to answer.
  - [ ] Basic "about you" questions (at least men's or women's clothing) are asked every time.
  - [ ] Event questions differ by event: a concert gets different questions than a fine-dining date.
  - [ ] Every question offers tap-to-choose options.
  - [ ] The whole follow-up step takes only a few taps, not a long form.

### Ranked Outfit Results
Source: `scope.md > The Unique Kernel` (this is the kernel).
- As the user, I want several complete outfits ranked from best to least, each explaining why it works, so that I can choose with confidence.
  - [ ] About five outfits appear, in a clearly ranked order (the best one is visibly first).
  - [ ] Each card shows every piece of the outfit: top, bottom, footwear, accessories (and outerwear when relevant).
  - [ ] Each piece shows a clothing illustration for its type, filled with its color.
  - [ ] The outfits clearly reflect the event and the follow-up answers. A fine-dining date doesn't get gym clothes.

### Outfit Detail and Shopping Links
Source: `scope.md > The POC Boundary` ("light links").
- As the user, I want to open an outfit and see why it works and where to buy each piece.
  - [ ] Clicking a card expands it in place.
  - [ ] The expanded card explains why the outfit suits the occasion and why the colors work together.
  - [ ] Each piece has an Amazon link that opens search results matching its description and color, with men's or women's applied.
  - [ ] No prices are shown.

## States and Boundaries
- **First use:** the start step with the text box and categories. You don't need to set anything up first.
- **Loading:** a loading animation while the outfits are being put together.
- **Unusable input:** for input like "asdf" or "my cat," the advisor shows a friendly message asking you to try again, with guidance on a better input (e.g. an example event description). You stay on the start step.
- **Failure:** if something breaks while getting outfits, the advisor shows a friendly message and a way to try again.
- **Persistence:** nothing is saved between visits. Every visit starts fresh, and the "about you" questions are asked again.

## Product Decisions
- **Text box and categories together:** "both is useful and clear how to use both." The text box keeps rich detail, and the categories help when you're stuck.
- **The advisor chooses the follow-up questions:** "I would expect the fashion advisor to know what follow up questions to ask." This fits the kernel, since the advisor makes the style call.
- **Ask "about you" every time; defer saving:** it keeps the PoC small, and saving doesn't help prove the kernel.
- **Expand in place, all pieces visible on one card:** "it would be nice to see all items in one card."
- **No prices:** search links can't provide real prices, and estimates would mislead. Prices are a stretch goal.
- **Light, minimal, fashion-store typography:** "it makes you feel like a fashion model."

**Assumptions (not learner decisions, open to change):**
- Event categories: about six common occasions (e.g. date night, concert, wedding guest, work event, party, casual outing). The advisor picks the exact list.
- Follow-ups appear together on one step, around three to five questions in total.
- A "start over" action on the results step lets you begin a new event.

## What We're Building
- A start step with a text box and tappable event categories.
- Tailored follow-up questions with tap-to-choose options, including "about you" every time.
- A loading animation.
- About five ranked outfit cards, each showing every piece as a color-tinted clothing illustration.
- Cards that expand in place to show the "why this works" explanation and an Amazon search link per piece.
- Friendly states for unusable input and for failures, with guidance and a retry.

## Deferred From the POC
- **Saving "about you" details:** this implies remembering data between visits, plus a way to view and edit it. It's not needed to prove the kernel.
- **Prices and an outfit total:** real prices need real product data, and the product API was cut in `scope.md > Explicitly Cut`.

## Possible Later Enhancements
- Generated images of a person, or of you, wearing the selected outfit (`scope.md > Later`).
- Using clothes you already own, mixed with new or other owned pieces (`scope.md > Later`).
- Offering style options as a choice, in addition to the recommended style.
- Remembering your details, with an option to reuse them.

## Non-Goals
- **Exact Amazon products or the product API:** it needs an affiliate account with sales history (`scope.md > Explicitly Cut`).
- **Outfit photos, product photos, or AI images in the PoC:** tinted illustrations give the visual feel without another service (`scope.md > Explicitly Cut`). Real product photos are a possible later enhancement.
- **Accounts or sign-in:** there's nothing to save.
- **Wardrobe management:** for now it suggests new items only.

## Open Questions
- **Project name:** "Wear Dis". "Dis" is Jamaican for "this", as in "wear this to this event". The learner chose it to add "a little bit of authentic me" so the app feels more human. It isn't aimed only at Jamaicans.
