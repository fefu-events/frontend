module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: "#FFFFFF",
        secondary: "#FF9058",
        disable: "#C7C7CC",
        success: "#13CE66",
        danger: "#FF4949",
        warning: "#FFCC3D",
      },
      backgroundImage: {
        "checked-icon": "url('/src/assets/img/svg/checked.svg')",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
