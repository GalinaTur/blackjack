const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  mode: "development",
  devServer: {
    static: './dist',
  },
  entry: './src/main.ts',
  plugins: [
    new HtmlWebpackPlugin({ 
      favicon: "./assets/favicon.png",
      template: './src/index.html' 
    }),
    new CopyPlugin({
      patterns: [
        { from: "./assets", to: "./assets" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};