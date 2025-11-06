import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf7f0',
          100: '#f5f0e1',
          200: '#e8ddc3',
          300: '#dac4a0',
          400: '#cda57c',
          500: '#b8905f',
          600: '#a3754a',
          700: '#8b7355',
          800: '#6f5a43',
          900: '#5a4634',
        },
        secondary: {
          50: '#f0f9e8',
          100: '#ddf2d1',
          200: '#bce5a3',
          300: '#91d16c',
          400: '#7ba845',
          500: '#7ba845',
          600: '#4a662a',
          700: '#3b5122',
          800: '#31401d',
          900: '#283419',
        },
        accent: {
          50: '#fef7ed',
          100: '#fdedd5',
          200: '#fad7ab',
          300: '#f5bc76',
          400: '#f0a441',
          500: '#d4862e',
          600: '#c17126',
          700: '#a25a21',
          800: '#83491e',
          900: '#6b3d1b',
        },
        neutral: {
          50: '#faf7f0',
          100: '#f5f0e1',
          200: '#e8ddc3',
          300: '#dac4a0',
          400: '#cda57c',
          500: '#b8905f',
          600: '#a3754a',
          700: '#8b7355',
          800: '#6f5a43',
          900: '#2d231b',
        },
        background: {
          page: '#e8ddc3',
          surface: '#faf7f0',
          elevated: '#ffffff',
        },
        semantic: {
          success: '#7ba845',
          warning: '#d4862e',
          error: '#c44536',
          info: '#5c7f9e',
        }
      },
      fontFamily: {
        heading: ['Press Start 2P', 'monospace'],
        subheading: ['VT323', 'monospace'],
        body: ['Lato', 'Inter', 'sans-serif'],
        mono: ['Courier Prime', 'monospace'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '24': '96px',
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      borderWidth: {
        'thin': '2px',
        'medium': '3px',
        'thick': '4px',
      },
      boxShadow: {
        'pixel': '4px 4px 0px rgba(43, 40, 36, 0.2)',
        'card': '0 2px 8px rgba(43, 40, 36, 0.08)',
        'card-hover': '0 8px 16px rgba(43, 40, 36, 0.12)',
        'modal': '0 16px 32px rgba(43, 40, 36, 0.16)',
      },
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '400ms',
      },
      opacity: {
        'disabled': '0.6',
        'hover': '0.8',
        'overlay': '0.5',
      }
    },
  },
  plugins: [],
};

export default config;
