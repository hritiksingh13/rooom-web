const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const versioningTimeStamp = new Date().getTime();

module.exports = {
  entry: './src/App.jsx',
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
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            noEmit: false,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
          },
        },
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
        use: ['style-loader', 'css-loader'],
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
  mode: 'production',
  resolve: {
    extensions: ['.jsx', '.js'],
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
      template: './public/index.html',
    }),
    new Dotenv({ path: './.env' }),
  ],
};
