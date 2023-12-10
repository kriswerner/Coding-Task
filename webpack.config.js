const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    './src/index.ts',
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: "[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
        exclude: /\.component.scss$/i,
      },
      {
        test: /\.component.html$/i,
        use: [
          'raw-loader',
        ],
      },
      {
        test: /\.component.scss$/i,
        use: [
          'raw-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
  },
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: false 
    }),
    new CopyPlugin({
      patterns: [{
        from: "src/assets",
        to: "assets",
        globOptions: {
          ignore: [
            '**/*.ttf',
            ]
        }
      }],
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};