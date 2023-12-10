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
      url: require.resolve('url/'),
      fs: false,
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      querystring: require.resolve('querystring-es3'),
      assert: require.resolve('assert/'),
      net: false,
      async_hooks: require.resolve('async_hooks')
    }
  },
};
