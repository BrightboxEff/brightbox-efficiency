import type { Config } from "tailwindcss";
import { BRAND } from "./lib/brand";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: BRAND.colors.mossGreen,
        gold: BRAND.colors.warmGold,
        cream: BRAND.colors.warmCream,
        charcoal: BRAND.colors.charcoal,
        "border-muted": BRAND.colors.borderMuted,
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
