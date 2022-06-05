const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  chainWebpack: (config) => {
    config.module
      .rule("pdf")
      .test(/\.pdf$/)
      .use("file-loader")
      .loader("file-loader");
  },
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
