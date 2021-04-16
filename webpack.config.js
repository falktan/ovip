const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  module: {
    rules: [
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
    new WebpackPwaManifest({
      name: 'OViP - Open Vision App',
      short_name: 'OViP',
      description: 'Recognize and use text from camera images',
      background_color: '#ffffff',
      orientation: 'omit',
      crossorigin: 'anonymous',
      publicPath: '.',
      icons: [
        {
          src: path.resolve('src/resources/icon_192.png'),
          sizes: [192]
        },
        {
          src: path.resolve('src/resources/icon_512.png'),
          sizes: [512]
        },
      ]
    })
  ]
};