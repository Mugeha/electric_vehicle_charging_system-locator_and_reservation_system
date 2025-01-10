module.exports = {
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        // Disable CSS minimizer plugin
        webpackConfig.optimization.minimizer = [];
        return webpackConfig;
      },
    },
  };
  