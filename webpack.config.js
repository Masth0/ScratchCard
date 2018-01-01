const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isDev = process.env.NODE_ENV === 'dev';

/*---- Javascript config -----------------------------------------------------------------------*/
const JS = {
  name: 'js',
  context: path.resolve('./src/js/'),
  watch: isDev,
  devtool: isDev ? 'inline-source-map' : false,
  entry: {
    scratchcard: './ScratchCard.ts',
  },
  output: {
    filename: '[name].js',
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

/*---- For production -----------------------------------------------------------------------*/
if (!isDev) {
  JS.output.filename = '[name].min.js';
  JS.plugins.push(new CleanWebpackPlugin(['./build'], { // remove ./build/js
    root: path.resolve('./'),
    verbose: true,
    dry: false,
  }));
  JS.plugins.push(new UglifyJsPlugin());
}

/*---- Export -----------------------------------------------------------------------*/
module.exports = [JS];
