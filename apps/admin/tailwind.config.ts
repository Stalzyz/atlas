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
        // ─── Brand Colors (Purple Palette from AwsmColor) ────────────
        wine: {
          tint:    '#DEACF5',
          light:   '#9754CB',
          DEFAULT: '#28104E',
          dark:    '#180930',
        },
        purple: {
          deep:    '#28104E',
          medium:  '#6237A0',
          light:   '#9754CB',
          lavender:'#DEACF5',
        },
        orchid: {
          DEFAULT: '#6237A0',
          light:   '#9754CB',
          dark:    '#28104E',
        },
        gold: {
          DEFAULT: '#9754CB',
          muted:   '#DEACF5',
          dark:    '#6237A0',
        },
        cream: {
          light:   '#FFFFFF',
          DEFAULT: '#FAFAFA',
          dark:    '#F0EEF8',
        },
        ivory: {
          light:   '#FFFFFF',
          DEFAULT: '#FAFAFA',
          dark:    '#F0EEF8',
        },
        charcoal: {
          light:   '#4A4A6A',
          DEFAULT: '#1A1A2E',
          dark:    '#0D0D1A',
        },
        // ─── Semantic CSS Variable Tokens ─────────────────────────────
        primary:            'var(--primary)',
        secondary:          'var(--secondary)',
        cta:                'var(--cta)',
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
