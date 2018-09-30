const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const devMode = process.env.NODE_ENV == 'development';

let config = {
  name: 'Assets',
  context: path.resolve('./src'),
  mode: devMode ? 'development' : 'production',
  watch: devMode,
  devServer: {
    overlay: true,
    stats: 'errors-only',
    // CORS
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  performance: {
    hints: devMode ? false : 'warning',
  },
  entry: {
    scratchcard: './ScratchCard.ts'
  },
  output: {
    filename: devMode ? '[name].js' : '[name].min.js',
    chunkFilename: '[name].bundle.js',
    path: __dirname + '/build',
    library: undefined,
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader','ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: []
};

module.exports = config;