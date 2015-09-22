var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: path.resolve(__dirname, 'src/app/main.jsx'),
  output: {
    path: 'build/prod',
    filename: './app.js'
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env": JSON.stringify(process.env)}),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'build/prod/index-template.html')
    }),
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: [node_modules],
        loader: 'babel' },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      { test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader' },
      {
        test: /\.(eot|ttf|woff|woff2|svg|svgz)($|\?)/,
        loader: 'file'
      },
      { test: /\.xml$/,
        loader: 'xml-loader' },
      { test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']},
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=image/svg+xml" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

module.exports = config;
