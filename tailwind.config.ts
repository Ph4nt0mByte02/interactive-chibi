import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f8f4ef',
        ink: '#2c1f1b',
        accent: '#ff7eb9',
        accent2: '#9d7bff',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(44, 31, 27, 0.14)',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-4px) rotate(-1.2deg)' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '94%, 96%': { transform: 'scaleY(0.1)' },
        },
      },
      animation: {
        sway: 'sway 4.2s ease-in-out infinite',
        blink: 'blink 5.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
