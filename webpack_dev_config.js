var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules/');

var deps = [
  'react/dist/react-with-addons.js',
  'marty/dist/marty.min.js',
  'immutable/dist/immutable.min.js',
];

var config = {
  entry: {
    app: [
    'webpack/hot/dev-server',
      path.resolve(__dirname, 'src/app/main.jsx')
    ],
    vendors: [
      'react',
      'marty',
      'immutable',
      'lodash'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build/dev'),
    filename: 'app.js',
    publicPath: 'http://localhost:8090/build/dev'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.DefinePlugin({ "process.env": JSON.stringify(process.env)})
  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false
    }
  },
  module: {
    loaders: [
      { test: path.resolve(node_modules, deps[0]),
        loader: "expose?React" },
      { test: /\.jsx?$/,
        exclude: [node_modules],
        loaders: ['react-hot', 'babel'] },
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
    ],
    noParse:[]
  },
  resolve: {
    alias: {
      'react/lib': path.resolve(node_modules, 'react/lib')
    },
    extensions: ['', '.js', '.jsx']
  }
};

deps.forEach(function(dep) {
  var depPath = path.resolve(node_modules, dep);
  config.resolve.alias[dep.split(path.sep)[0]] = depPath;
  config.module.noParse.push(depPath);
});

module.exports = config;
