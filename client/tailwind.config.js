/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        'custom-beige': '#cdc2ae',
        'custom-tan': '#aea293',
        'custom-light': '#f3f0eb',
        'custom-super-light': '#ededeb',
        'custom-gray': '#8f8272',
        'custom-dark': '#413a31',
        'custom-white': '#F9F9F9',
        'custom-black-dark': '#3A3B3B',
        'custom-gray-ligh': '#E1E1E2',
        'custom-gray-darkest': '#888889',
        'custom-gray-darker': '#A7A7A7',
        'custom-purple': '#5440A1',
        'custom-pink': '#F22CA3',
        'custom-sky': '#cdd1da',
        'custom-dark-fog': '#596f84',
        'custom-darkest-tree': '#2b3643',
        'custom-light-tree':'#909eae',
        'custom-dark-tree':'#738495',
        'custom-darker-tree': '#5d7184',
        'custom-lighter-tree': '#8493a4',
        'custom-medium-dark-tree': '#4c5c6b'
        
      },
    },
  },
  plugins: [],
}