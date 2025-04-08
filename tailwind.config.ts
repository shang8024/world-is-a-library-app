import type { Config } from "tailwindcss"

import twAnimateCss from 'tw-animate-css';

const tailwindConfig = {
  darkMode: false, // or 'media' or 'class'
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx}',
    './src/components/**/*.{html,js,jsx,ts,tsx}',
    './src/app/**/*.{html,js,jsx,ts,tsx}',
    './@/**/*.{ts,tsx}',
    './@/components/**/*.{ts,tsx}',
    './@/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [twAnimateCss],
} satisfies Config;

export default tailwindConfig;
