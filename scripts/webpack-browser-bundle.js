import path from 'node:path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { thirdPartyNotices } from './third-party-notices.js';

/**
 * The UMD browser bundle this package ships. It is a factory because the
 * compatibility wrapper published as @speclynx/apidom-ls@2.13.0 used the same
 * build with a different filename and global, keeping the names a CDN consumer
 * already followed; that package has since left the workspace.
 *
 * The bundle declares no `externals`, so it embeds every production dependency
 * and carries their licences with it; see `third-party-notices.js`.
 */
export const browserBundle = ({
  packageName,
  filename,
  library,
  entry = './src/index.ts',
  recoveredDirectory,
  inventoryPath,
  licenseTextOverrides = {},
  additionalModules = [],
}) => {
  const notices = thirdPartyNotices({
    packageName,
    recoveredDirectory,
    inventoryPath,
    licenseTextOverrides,
    additionalModules,
  });

  return {
    mode: 'production',
    entry: [entry],
    target: 'web',
    performance: {
      maxEntrypointSize: 2500000,
      maxAssetSize: 2500000,
    },
    output: {
      path: path.resolve('./dist'),
      filename,
      libraryTarget: 'umd',
      library,
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
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      notices.plugin,
    ],
    ignoreWarnings: [notices.ignoreWarning],
    optimization: {
      minimize: true,
      // The notices are generated from what webpack reports it included, and
      // scope hoisting merges every ES module into its importer, which hides
      // the package it came from. Attribution is worth more here than the few
      // kilobytes hoisting saves.
      concatenateModules: false,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: true,
            // The notices file carries the full texts; this keeps the licence
            // headers that some bundled code asks to be kept with it in place.
            format: { comments: /^\**!|@preserve|@license|@cc_on/i },
          },
        }),
      ],
    },
  };
};
