import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F8F5F2",
          dark: "#E8DED7",
        },
        beige: {
          DEFAULT: "#E8DED7",
          dark: "#D6AFAF",
          light: "#F8F5F2"
        },
        rose: {
          DEFAULT: "#D6AFAF",
          dark: "#B08D8D"
        },
        wine: {
          DEFAULT: "#590100", // Wine Red
          dark: "#3D0C0F",
          light: "#7B181E",
        },
        charcoal: {
          DEFAULT: "#1A1A1A",
          dark: "#0A0A0A",
          light: "#3A3A3A",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
