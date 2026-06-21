import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // ─── Brand Colors (unified with storefront) ───────────────────
        wine: {
          tint:    '#A9445B',
          light:   '#8C1C2A',
          DEFAULT: '#6D0F1B', // ✅ Fixed: was #590100, now matches storefront
          dark:    '#4D0A13',
        },
        ivory: {
          light:   '#FDFCFB',
          DEFAULT: '#F8F5F2',
          dark:    '#E8DED7',
        },
        charcoal: {
          light:   '#3A3A3A',
          DEFAULT: '#1A1A1A',
          dark:    '#0A0A0A',
        },
        beige: {
          light:   '#F9F7F5',
          DEFAULT: '#E8DED7',
          dark:    '#D6BCB4',
        },
        rose: {
          light:   '#EAD1D1',
          DEFAULT: '#D6AFAF',
          dark:    '#B08D8D',
        },
        gold: {
          DEFAULT: '#C6A769',
          muted:   '#D4C3A1',
        },
        // ─── Semantic CSS Variable Tokens ─────────────────────────────
        primary:            'var(--primary)',
        'theme-bg':         'var(--bg)',
        'theme-surface':    'var(--surface)',
        'theme-text':       'var(--text-primary)',
        'theme-text-muted': 'var(--text-secondary)',
        'theme-border':     'var(--border)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
