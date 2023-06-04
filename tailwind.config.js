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
      width: {
        128: "55rem",
      },
      height: {
        128: "55rem",
      },
      zIndex: {
        1000: "1000",
      },
      inset: {
        "-16": "-4rem", // Örnek bir negatif değer
      },
      colors: {
        // TODO: Tema renkleri ayarla
        // dark theme
        dark: {
          primary: "#03001C",
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
        },
        // light theme
        light: {
          primary: "#F9F5F6",
          secondary: "#F8E8EE",
          background: "#FDF4F5",
          dropzone: "#FDCEDF",
          dropzoneBorder: "#F2D1D1",
          hover: "#c4c4c4",
          searchBar: "#e2e2e2",
          border: "#d3d3d3",
          text: "#7E1717",
          gray: {
            100: "#f7fafc",
            900: "#1a202c",
          },
        },
      },
    },
  },
  plugins: [],
};
