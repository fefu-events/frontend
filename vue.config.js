const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    https: process.env.VUE_APP_HTTPS == "true",
    proxy: {
      "^/api": {
        target: process.env.VUE_APP_PROXY_API,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
