/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Symbiosis brand colors - derived from brand assets
        // Dark cosmic theme with gold/cyan dual accents

        // Background shades
        space: {
          900: '#0a0a14',  // Deep space - main background
          800: '#121220',  // Slightly lighter
          700: '#1a1a24',  // Card backgrounds / surface
          600: '#22222e',  // Elevated surface
          500: '#2a2a34',  // Subtle borders
        },

        // Text colors
        text: {
          primary: '#f4f4f8',    // Near white
          secondary: '#a0a0b0',  // Muted
          tertiary: '#6a6a7a',   // Very muted
        },

        // Gold accent (human/warm)
        gold: {
          50: '#fef9e8',
          100: '#fdf0c3',
          200: '#fce48a',
          300: '#f9d447',
          400: '#f4c24b',  // Primary gold
          500: '#d4a84b',  // Darker gold
          600: '#b8922a',
          700: '#8f6f1c',
          800: '#6b5318',
          900: '#4a3a12',
        },

        // Cyan accent (AI/cool)
        cyan: {
          50: '#e8f9fe',
          100: '#c3f0fd',
          200: '#8ae4fc',
          300: '#47d4f9',
          400: '#4bc4f4',  // Primary cyan
          500: '#4ba8d4',  // Darker cyan
          600: '#2a8bb8',
          700: '#1c6b8f',
          800: '#18536b',
          900: '#123a4a',
        },

        // Status colors
        status: {
          success: '#4bd4a8',   // Green-cyan
          warning: '#d4a84b',   // Gold
          error: '#d44b4b',     // Red
          info: '#4ba8d4',      // Cyan
        },

        // Presence indicator colors
        presence: {
          active: '#4bd4a8',    // Green for active
          idle: '#d4a84b',      // Gold/amber for idle
          offline: '#6a6a7a',   // Gray for offline
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 168, 75, 0.15)',
        'glow-cyan': '0 0 20px rgba(75, 168, 212, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },

      backgroundImage: {
        // Subtle gradient for cards/surfaces
        'surface-gradient': 'linear-gradient(180deg, rgba(42, 42, 52, 0.5) 0%, rgba(26, 26, 36, 0.5) 100%)',
        // Network pattern overlay (for ambient backgrounds)
        'network-pattern': 'radial-gradient(circle at 25% 25%, rgba(75, 168, 212, 0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(212, 168, 75, 0.03) 0%, transparent 50%)',
      },

      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
