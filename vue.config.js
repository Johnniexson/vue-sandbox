// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()],
    resolve: {
      alias: {
        moment: "moment/src/moment",
      },
    },
  },
};
