/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TODO: Tema renkleri ayarla
        // dark theme
        dark: {
          primary: "#432C7A",
          secondary: "#2A2F4F",
          gray: {
            100: "#f7fafc",
            900: "#1a202c",
          },
          // light theme
          light: {
            primary: "#fff",
          },
        },
      },
    },
  },
  plugins: [],
};
