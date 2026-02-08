import path from 'node:path';
import { minimizeTrait } from './traits.config.js';

const browserMin = {
  mode: 'production',
  entry: ['./src/index.ts'],
  target: 'web',
  performance: {
    maxEntrypointSize: 2500000,
    maxAssetSize: 2500000,
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'apidom-ls.browser.min.js',
    libraryTarget: 'umd',
    library: 'apidomLs',
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json'],
    fallback: {
      fs: false,
      path: false,
      module: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        use: 'null-loader',
      },
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            rootMode: 'upward',
            cacheDirectory: false,
          },
        },
      },
    ],
  },
  ...minimizeTrait,
};

export default [browserMin];
