const path = require("path");
module.exports = {
  entry: {
    lobby: "./frontend/lobby/index.js",
    chat: "./frontend/chat/index.js",
    games: "./frontend/games/index.js"
  },
  output: {
    path: path.join(__dirname, "backend", "static", "scripts"),
    publicPath: "/backend/static/scripts",
    filename: "[name].js",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  resolve: {
    alias: {
      "@constants": path.resolve(__dirname, "constants"),
      'node:path': path.resolve(__dirname, 'node_modules/path'),
    },
    fallback: {
      "crypto": require.resolve('crypto-browserify'),
      "fs": false, // or require.resolve('fs') if needed
      "http": require.resolve('stream-http'),
      "net": false, // or require.resolve('net') if needed
      "stream": require.resolve('stream-browserify'),
      "zlib": require.resolve('browserify-zlib'),
      "querystring": require.resolve('querystring-es3'),
      "buffer": require.resolve('buffer/'),
      "url": require.resolve('url/'),
      "assert": require.resolve("assert/"),
      "async_hooks": false,

    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
 }
 
};
