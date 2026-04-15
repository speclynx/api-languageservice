import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

export const minimizeTrait = {
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
          mangle: true,
          keep_classnames: true,
        },
      }),
    ],
  },
};
