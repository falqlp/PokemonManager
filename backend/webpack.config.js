const path = require("path");

module.exports = {
  mode: "production",
  entry: "./app.ts",
  externals: {
    kerberos: "commonjs kerberos",
    "@mongodb-js/zstd": "commonjs @mongodb-js/zstd",
    "@aws-sdk/credential-providers": "commonjs @aws-sdk/credential-providers",
    snappy: "commonjs snappy",
    aws4: "commonjs aws4",
    "mongodb-client-encryption": "commonjs mongodb-client-encryption",
    bufferutil: "commonjs bufferutil",
    "utf-8-validate": "commonjs utf-8-validate",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
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
  target: "node",
};
