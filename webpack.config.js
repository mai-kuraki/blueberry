var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: [
          'react-hot-loader/webpack',
          'babel-loader',
        ],
        include: path.join(__dirname),
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.css$/,
        loader: [ 'style-loader', 'css-loader' ],
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader",
          options: {
            javascriptEnabled: true
          }
        }]
      },
      {
        test: /\.scss$/,
        loader: [ 'style-loader', 'css-loader?modules', 'sass-loader' ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name]_[hash:7].[ext]',
            }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.ProvidePlugin({
        "React": "react",
    }),
  ],
  target: "electron-renderer"
};
