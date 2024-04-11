const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./server.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /\.html$/,
    }),
  ],
  target: "node",
};
