// All user-facing text and accessibility labels.

export const STRINGS = {
  meta: {
    title: "Outfit Advisor",
    description: "Tell us the occasion. We'll dress you for it and tell you why.",
  },
  brand: "Outfit Advisor",
  start: {
    heading: "What's the occasion?",
    subheading: "Tell me where you're going and I'll put together looks that fit, and explain why.",
    inputLabel: "Describe your event",
    inputPlaceholder: "e.g. A romantic date at a fine-dining restaurant",
    submit: "Dress me",
  },
  loading: {
    message: "Putting your looks together…",
    detail: "This usually takes about 30 seconds.",
  },
  results: {
    heading: "Your looks",
    subheading: "Ranked from my top pick down.",
    bestPick: "Best pick",
    rankLabel: (rank: number): string => `Option ${rank}`,
    whyOccasion: "Why it works for the occasion",
    whyColors: "Why the colors work",
    piecesLabel: "Pieces in this outfit",
    swatchLabel: (colorName: string): string => `Color: ${colorName}`,
  },
  slots: {
    top: "Top",
    bottom: "Bottom",
    dress: "Dress",
    outerwear: "Outerwear",
    footwear: "Shoes",
    accessory: "Accessory",
  },
  error: {
    generic: "Something went wrong putting your looks together. Please try again.",
  },
} as const;
