const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const versioningTimeStamp = new Date().getTime();

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(config)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.mp4$/,
        use: 'file-loader?name=videos/[name].[ext]',
      },
      {
        test: /chart.js/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
    ],
  },
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    port: 3001,
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['*', '.jsx', '.js'],
  },
  output: {
    filename: `bundle${versioningTimeStamp}.js`,
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Rooom',
      template: path.resolve(__dirname, 'public/index.html'),
      favicon: path.resolve(__dirname, 'public/favicon.ico'),
      manifest: path.resolve(__dirname, 'public/manifest.json'),
    }),
    new Dotenv({ path: './.env.dev' }),
  ],
};
