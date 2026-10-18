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
    submit: "Continue",
    categoriesLabel: "Or pick the closest occasion",
    exampleLabel: "Try something like:",
    useExample: "Use this example",
  },
  followUps: {
    heading: "A few quick questions",
    subheading: "Tap the answer that fits best. This helps me get it right for you.",
    genderQuestion: "Which clothing section do you shop in?",
    genderOptions: { men: "Men's", women: "Women's" },
    submit: "Find my outfits",
    back: "Change occasion",
  },
  loading: {
    questionsMessage: "Thinking about your occasion…",
    questionsDetail: "Just a few seconds.",
    outfitsMessage: "Putting your looks together…",
    outfitsDetail: "This usually takes about 30 seconds.",
  },
  results: {
    heading: "Your looks",
    subheading: "Ranked from my top pick down.",
    bestPick: "Best pick",
    rankLabel: (rank: number): string => `Option ${rank}`,
    whyOccasion: "Why it works for the occasion",
    whyColors: "Why the colors work",
    piecesLabel: "Pieces in this outfit",
    expand: "See why it works & shop",
    collapse: "Hide details",
    shop: "Shop on Amazon",
    shopLabel: (colorName: string, pieceName: string): string =>
      `Shop ${colorName} ${pieceName} on Amazon (opens in a new tab)`,
    startOver: "Start over with a new occasion",
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
