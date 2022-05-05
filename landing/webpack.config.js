const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

require('dotenv').config();

module.exports = {
  mode: 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: '/',
  },
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        include: [
          path.resolve(__dirname, 'node_modules/@loot-box/common'),
          path.resolve(__dirname, '../common'),
          path.resolve(__dirname, 'src'),
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.woff$/, /\.woff2$/, /\.svg$/, /\.png$/],
        use: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: 'public' }] }),
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NETWORK: JSON.stringify(process.env.NETWORK),
      },
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    port: 3002,
    hot: false,
    inline: false,
    liveReload: false,
    open: false,
    historyApiFallback: true,
  },
};
