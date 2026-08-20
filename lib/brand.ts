/**
 * lib/brand.ts
 * Brightbox Efficiency Consultants brand tokens.
 * Reference these in Tailwind config / components so the whole app
 * stays consistent with the Brightbox identity.
 */

export const BRAND = {
  name: "Brightbox Efficiency Consultants",
  productName: "Brightbox Efficiency",
  tagline: "Rooted in reliability. Driven by efficiency.",
  colors: {
    mossGreen: "#4A5D3A",   // primary — buttons, headers, nav
    warmGold: "#C9962B",    // accent — highlights, CTAs, key numbers
    warmCream: "#F5F1E8",   // background — page background, cards
    // Supporting neutrals (derived, not part of the original 3-colour palette,
    // but needed for readable text and borders)
    charcoal: "#2B2B25",    // body text
    borderMuted: "#DCD5C2", // card borders / dividers
  },
  contactEmail: "paul@brightboxefficiency.com",
};
