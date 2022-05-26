const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    // https: true,
    proxy: {
      "^/api": {
        // target: "https://0804-89-113-101-231.jp.ngrok.io/",
        target: "http://localhost:8000",
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
