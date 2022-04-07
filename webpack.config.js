const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/js/index.js',
    firebase: './src/js/firebase.js',
    auth: './src/js/auth.js',
    adm: './src/adm/admin.js'
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['index', 'auth']
    }),
    new HtmlWebpackPlugin({
      filename: 'autenticacao.html',
      template: './src/autenticacao.html',
      chunks: ['firebase', 'auth']

    }),
    new HtmlWebpackPlugin({
      filename: 'adm/adicionar-novo.html',
      template: './src/adm/adicionar-novo.html',
      chunks: ['firebase', 'auth']
    }),
    new HtmlWebpackPlugin({
      filename: 'adm/delete.html',
      template: './src/adm/delete.html',
      chunks: ['firebase', 'auth']
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