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
      opacity: {
        4: '0.04',
        6: '0.06',
        8: '0.08',
        12: '0.12',
        85: '0.85',
        98: '0.98',
      },
      boxShadow: {
        glow: '0 0 24px rgba(34, 197, 94, 0.25)',
        'glow-sm': '0 0 12px rgba(34, 197, 94, 0.18)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.45)',
        elevate: '0 12px 40px -12px rgba(34, 197, 94, 0.15), 0 8px 32px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(ellipse 60% 50% at 70% 10%, rgba(34,197,94,0.13) 0%, rgba(34,197,94,0) 60%)',
      },
      backgroundSize: {
        grid: '44px 44px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'bar-grow': {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.35s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        'bar-grow': 'bar-grow 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;