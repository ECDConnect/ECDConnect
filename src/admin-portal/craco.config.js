module.exports = {
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
 webpack: {
    configure: (webpackConfig) => {
      const babelLoaderRule = webpackConfig.module.rules
        .find(rule => Array.isArray(rule.oneOf))
        ?.oneOf?.find(r => r.loader?.includes('babel-loader'));

      if (babelLoaderRule) {
        babelLoaderRule.include = [
          babelLoaderRule.include,
          /node_modules[\\\/]graphql/
        ];
      }

      return webpackConfig;
    }
  },
  }