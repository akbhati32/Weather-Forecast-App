/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../src/**/*.{html,js}",
    "index.html",
  ],
  theme: {
    extend: {
      colors: {
        'header': '#0d142a',
        'search': '#293248',
        'box': '#70DAF3',
        'boxbg': '#269EC0',
        'background': '#DBEAFE',
      },
      screens: {    // Responsive Screens
        'sm': {'min': '100px', 'max': '376px'},     // iPhone SE
        // => @media (min-width: 100px and max-width: 376px) { ... } 
  
        'md': {'min': '377px', 'max': '769px'},     // iPad Mini
        // => @media (min-width: 377px and max-width: 769px) { ... }
  
        'lg': {'min': '770px', 'max': '1281px'},    // Laptop
        // => @media (min-width: 770px and max-width: 1281px) { ... }
  
        'xl': {'min': '1282px', 'max': '1535px'},   // Desktop
        // => @media (min-width: 1282px and max-width: 1535px) { ... }
      },
    },
  },
  plugins: [],
}
