module.exports = {
    // Tailwind is NOT in this pipeline. react-scripts 4 is PostCSS 7 throughout
    // (postcss-loader@3, postcss-preset-env@6) and Tailwind v3 requires PostCSS 8,
    // so Tailwind is compiled ahead of the webpack build by its own CLI — see the
    // `tailwind:*` scripts in package.json. CRA only ever sees plain CSS.
    style: {
      postcss: {
        plugins: [
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