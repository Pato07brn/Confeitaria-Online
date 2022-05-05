const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/js/index.js',
    firebase: './src/js/firebase.js',
    auth: './src/js/auth.js',
    atualizar: './src/js/atualizar.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'adm/index.html',
      template: './src/adm/index.html',
      chunks: ['auth', 'atualizar']
    }),
    new HtmlWebpackPlugin({
      filename: 'adm/autenticacao.html',
      template: './src/adm/autenticacao.html',
      chunks: ['firebase', 'auth']

    }),
    new HtmlWebpackPlugin({
      filename: 'adm/adicionar-novo.html',
      template: './src/adm/adicionar-novo.html',
      chunks: ['firebase', 'auth']
    }),
    new HtmlWebpackPlugin({
      filename: 'adm/atualizar.html',
      template: './src/adm/atualizar.html',
      chunks: ['firebase', 'auth', 'atualizar']
    }),
    new HtmlWebpackPlugin({
      filename: 'adm/consultar.html',
      template: './src/adm/consultar.html',
      chunks: ['firebase', 'auth']
    }),
    new HtmlWebpackPlugin({
      filename: 'adm/delete.html',
      template: './src/adm/delete.html',
      chunks: ['firebase', 'auth']
    }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/index.html',
      chunks: ['index' , 'firebase']
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