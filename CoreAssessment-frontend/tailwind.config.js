/** @type {import('tailwindcss').Config} */
export default {
  content: [
"./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
"./node_modules/preline/**/*.js",
],
theme: {
  extend: {
    animation: {
      bounce:'bounce 1.5s infinite'
    },
  },
},
plugins: [],
}
