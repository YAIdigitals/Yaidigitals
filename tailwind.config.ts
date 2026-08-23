import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',
        primaryDark: '#16a34a',
        primaryGlow: 'rgba(34, 197, 94, 0.4)',
        bgDark: '#050505',
        bgCard: '#0a0a0a',
        bgGlass: 'rgba(20, 20, 20, 0.6)',
        textMain: '#ffffff',
        textMuted: '#c5c5c5',
        border: 'rgba(255, 255, 255, 0.08)',
        accentYellow: '#facc15',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;