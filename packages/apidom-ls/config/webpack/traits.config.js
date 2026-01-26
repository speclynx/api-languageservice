import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import WebpackObfuscator from 'webpack-obfuscator';

export const minimizeTrait = {
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    process.env.OBFUSCATE === 'true' &&
      new WebpackObfuscator({
        target: 'browser',
      }),
  ].filter(Boolean),
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: true,
          format: {
            comments: false,
          },
          mangle: true,
        },
      }),
    ],
  },
};
