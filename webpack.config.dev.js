const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'src/index.js')
  ],
  output: {
    path: path.join(__dirname, 'page'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: [
          'react-hot-loader/webpack',
          'babel-loader',
          'eslint-loader'
        ],
        include: path.join(__dirname),
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.css$/,
        loader: [ 'file-loader', 'style-loader', 'css-loader' ],
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
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        }
      }
    ],
  },
  devtool: '#cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: 3000,
    host: '127.0.0.1',
    overlay: {
      errors: true
    },
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template:'./page/index.html',
      filename:'index.html',
      hash:true,
    }),
    new webpack.ProvidePlugin({
        "React": "react",
    }),
  ],
  target: "electron-renderer"
};
