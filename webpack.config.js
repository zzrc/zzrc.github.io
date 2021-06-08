const path = require('path')

const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env = {
  noSourceMap: false,
  noMinify: false
}, argv = {}) => ({
  mode: argv.mode,

  entry: './src/index.js',

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[id].[chunkhash].js',
    path: path.resolve(__dirname, argv['output-path'] || 'docs'),
  },

  plugins: [
    new HtmlPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[chunkhash].css',
      ignoreOrder: true,
    }),
    ...(argv.mode === 'production' ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
    ] : []),
  ],

  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|png|jpg|tgs|ico|pdf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
        },
      },
      {
        test: /\.(ico|pdf|mp3)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /-extra\.json$/,
        loader: 'file-loader',
        type: 'javascript/auto',
        options: {
          name: '[name].[contenthash].[ext]',
        },
      },
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto',
        options: {
          name: '[name].[contenthash].[ext]',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js'],
  },

  ...(!env.noSourceMap && {
    devtool: 'source-map',
  }),

  optimization: {
    minimize: !env.noMinify,
    minimizer: [
      new TerserJSPlugin(),
      new OptimizeCSSAssetsPlugin({}),
    ]
  },

  devServer: {
    contentBase: [
      path.resolve(__dirname, 'public'),
      path.resolve(__dirname, 'src'),
    ],
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true,
    stats: 'minimal',
    hot: true,
  },
});
