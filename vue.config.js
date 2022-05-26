const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    https: process.env.VUE_APP_ROOT_API_HTTPS,
    proxy: {
      "^/api": {
        target: process.env.VUE_APP_ROOT_API,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
