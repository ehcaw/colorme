// webpack.config.js
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "index.html", to: "index.html" },
        { from: "index.js", to: "index.js" },
        { from: "manifest.json", to: "manifest.json" },
        { from: "sidepanel.jsx", to: "sidepanel.jsx" },
        { from: "global.css", to: "global.css" },
        { from: "images", to: "images" },

        // Add more patterns for other files if needed
      ],
    }),
  ],
};
