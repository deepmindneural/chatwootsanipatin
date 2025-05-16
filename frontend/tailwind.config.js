/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/componentes/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primario: {
          DEFAULT: '#00B2B2', // turquesa/cyan como color corporativo principal
          light: '#33C3C3',
          dark: '#008A8A',
        },
        secundario: {
          DEFAULT: '#3F51B5',
          light: '#5C6BC0',
          dark: '#303F9F',
        },
        gris: {
          100: '#f7f7f7',
          200: '#e6e6e6',
          300: '#d5d5d5',
          400: '#b0b0b0',
          500: '#8c8c8c',
          600: '#686868',
          700: '#444444',
          800: '#202020',
          900: '#121212',
        },
        estado: {
          pendiente: '#FFA726', // naranja
          activo: '#66BB6A',    // verde
          resuelto: '#42A5F5',  // azul
          cerrado: '#78909C'    // gris azulado
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
