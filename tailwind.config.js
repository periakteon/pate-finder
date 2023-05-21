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
          primary: "#fff",
          secondary: "#15202b",
          background: "#0d131a",
          dropzone: "#161f2b",
          dropzoneBorder: "#27384d",
          hover: "#334756",
          searchBar: "#212A3E",
          border: "#27384d",
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
