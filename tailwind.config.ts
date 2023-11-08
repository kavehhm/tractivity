// @ts-nocheck
import { type Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */


export default {
  darkMode: '',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),

  ],
} 
