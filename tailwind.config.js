const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: "#FF9058",
        gray: {
          dark: "#C7C7CC",
          light: "#E5E5E5",
        },
        success: "#13CE66",
        danger: "#FF4949",
        warning: "#FFCC3D",
      },
      backgroundImage: {
        "checked-icon": "url('/src/assets/img/svg/checked.svg')",
      },
      fontFamily: {
        sans: ["Verdana", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
