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
      favicon: "./assets/images/favicon.png",
      template: './src/index.html' 
    }),
    new CopyPlugin({
      patterns: [
        { from: "./assets/images/exported", to: "./assets/images/exported" },
        { from: "./assets/images/buttons", to: "./assets/images/buttons" },
        { from: "./assets/sounds/exported", to: "./assets/sounds/exported" },
        { from: "./assets/fonts", to: "./assets/fonts" },
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