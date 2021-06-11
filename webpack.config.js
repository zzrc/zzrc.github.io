const path = require("path");

const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = async (
  env = {
    noSourceMap: false,
    noMinify: false
  },
  argv = {}
) => {
  return {
    mode: argv.mode,

    entry: {
      index: path.join(__dirname, "src", "index.js")
    },

    output: {
      filename: "js/[name].[chunkhash].js",
      path: path.resolve(__dirname, argv["output-path"] || "docs")
    },

    plugins: [
      new HtmlPlugin({
        filename: "index.html",
        template: path.join(__dirname, "src", "index.html"),
        chunks: ["index"],
        chunksSortMode: "manual",
        minify: {
          removeComments: false
        }
      }),
      new CopyPlugin({
        patterns: [{ from: "public", to: "." }]
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[name].[chunkhash].css",
        ignoreOrder: true
      }),
      ...(argv.mode === "production"
        ? [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
          })
        ]
        : [])
    ],

    performance: {
      assetFilter(assetFilename) {
        return !/\.(map|png|jpg|gif|glb|webm)$/.test(assetFilename);
      }
    },

    module: {
      rules: [
        {
          test: /\.(js)$/,
          loader: "babel-loader",
          include: path.resolve(__dirname, "src"),
          exclude: path.resolve(__dirname, "node_modules")
        },
        {
          test: /\.(scss|css)$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: "css-loader" },
            { loader: "sass-loader" }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|png|jpg|tgs|ico|pdf)(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader",
          options: {
            name: "[name].[contenthash].[ext]"
          }
        },
        {
          test: /\.(ico|pdf|mp3)(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader"
        },
        {
          test: /-extra\.json$/,
          loader: "file-loader",
          type: "javascript/auto",
          options: {
            name: "[name].[contenthash].[ext]"
          }
        },
        {
          test: /\.wasm$/,
          loader: "file-loader",
          type: "javascript/auto",
          options: {
            name: "[name].[contenthash].[ext]"
          }
        }
      ]
    },

    resolve: {
      extensions: [".js"]
    },

    ...(!env.noSourceMap && {
      devtool: argv.mode === "production" ? "source-map" : "inline-source-map"
    }),

    optimization: {
      minimize: !env.noMinify,
      minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin({})],
      splitChunks: {
        maxAsyncRequests: 10,
        maxInitialRequests: 10
      }
    },

    devServer: {
      contentBase: [
        path.resolve(__dirname, "public"),
        path.resolve(__dirname, "src")
      ],
      host: "0.0.0.0",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      useLocalIp: true,
      disableHostCheck: true,
      stats: "minimal",
      hot: true,
      inline: true
    }
  };
};
