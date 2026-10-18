---
doc: scope
status: approved
---

# Outfit Advisor (working name)

A personal fashion advisor. You tell it about an event, and it recommends ranked, complete outfits. It explains why each one works, and every piece links to Amazon to buy.

## The Unique Kernel
It doesn't just show outfits. It gives you **confidence to pick one** by explaining *why* each outfit fits the occasion and why the colors work together, ranked from best to least. Pinterest shows good-looking outfits but assumes you already know which one fits and why. This advisor makes the style call for you.

## Who It's For
The learner, first: someone who "can't decide what to wear," doesn't know "which colors works well with others," and doesn't know styles. They want an advisor to decide, not just a gallery to choose from. Today they browse Pinterest outfit boards. Others with the same problem could use it later.

## The Core Loop
1. Describe an upcoming event in plain words, e.g. "a romantic date at a fine-dining restaurant."
2. Answer a few short follow-up questions so it understands the occasion.
3. See about five complete outfits, ranked best first. Each one covers clothing, footwear, accessories, and colors, with a short "why this works."
4. Pick one and get an Amazon link for every piece.

They come back for each new event they don't know how to dress for.

## Inspiration & Identity
Pinterest outfit boards (https://www.pinterest.com): visual, put-together, browsable looks. It should feel like a knowledgeable friend who reassures you, not a catalog.

## Why This Matters to the Learner
"Sometimes I can't decide what to wear." They want a personal advisor and the confidence that their choice is right. They're building it mostly for themselves, but "it would be great if others find it useful."

## What "Working" Looks Like
In a one-minute demo:
1. Type "I'm going on a romantic date to a fine-dining restaurant."
2. Answer a couple of follow-up questions.
3. See five ranked outfit cards, each with an explanation of why it suits the occasion.
4. Click the top one and see Amazon links for every piece, in matching colors.

**"Oh, that's cool" beat:** the ranked explanations. It tells you *why* the best option is best.

## The POC Boundary
- Free-text event description, followed by a few clarifying questions.
- About five complete outfits (top, bottom, footwear, accessories), ranked, each with a "why it works" explanation.
- **Light visuals:** each outfit is shown as a card listing its pieces with color swatches, not photos.
- **Light links:** each piece gets an Amazon *search* link built from its description and color (e.g. "navy slim-fit blazer men"). It lands on real results close to the piece, with color as the priority.
- Suggests new items only.

## Later
- Generated images of a person wearing each outfit, perhaps only for the selected one.
- Seeing *yourself* wearing the outfits.
- Using clothes you already own, mixed with new items or with other owned pieces.
- Offering style options as a choice, in addition to the recommended style.

## Explicitly Cut
- **Exact Amazon products through Amazon's product API.** It requires an approved affiliate account with sales history, which isn't realistic for a hackathon. Search links cover the need.
- **AI-generated outfit images in the PoC.** They're slow, cost money per image, and wouldn't match the linked products. Swatch cards prove the kernel without them.
