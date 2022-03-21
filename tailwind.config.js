module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: "#FFFFFF",
        secondary: "#000000",
        hoverPrimary: "#FF9058",
        success: "#13CE66",
        danger: "#FF4949",
        warning: "#FFCC3D",
      },
      z: {
        500: "500",
      },
    },
  },
  plugins: [],
};
