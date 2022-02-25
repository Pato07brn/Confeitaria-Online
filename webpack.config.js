const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/js/index.js',
    firebase: './src/js/firebase.js',
    adm: './src/adm/admin.js'
  },
  output: {
    filename: 'js/[name].js',
     path: path.resolve(__dirname, 'dist'),
   },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'adicionar-novo.html',
      template: './src/adicionar-novo.html'
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
    ],
  },
  experiments: {
    topLevelAwait: true,
  },
};