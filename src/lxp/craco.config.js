const CracoAlias = require('craco-alias');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer'), ...(process.env.NODE_ENV === 'production'
        ? [require('cssnano')]
        : [])],
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
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
};
