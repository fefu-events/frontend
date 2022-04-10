const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    // https: true,
    proxy: {
      "^/api": {
        target: "http://localhost:8000/",
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
