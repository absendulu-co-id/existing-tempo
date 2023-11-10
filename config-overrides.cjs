/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const { useBabelRc, override, addWebpackModuleRule } = require("customize-cra");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const webpack = require("webpack");
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require("zlib");

const dateFnsSupportedLocales = ["en-US", "id"];

module.exports = override(
  // Fix @material-table/core v5 deepmerge error
  addWebpackModuleRule({
    test: /deepmerge/,
    exclude: /cjs.js/,
  }),
  (oldConfig) => {
    const config = useBabelRc()(oldConfig);
    // config.experiments = {
    //  topLevelAwait: true,
    // };

    // #region Faster TypeScript Build
    const forkTsCheckingPluginIndex = config.plugins.findIndex(
      ({ options }) => options && Object.keys(options).find((option) => option === "tsconfig"),
    );

    config.plugins.splice(forkTsCheckingPluginIndex, 1);
    // #endregion

    config.devtool = process.env.NODE_ENV !== "production" ? "source-map" : "nosources-source-map";

    config.resolve.fallback = { crypto: false, fs: false };
    config.ignoreWarnings = [
      function ignoreSourcemapsloaderWarnings(warning) {
        return warning.module?.resource.includes("node_modules") && warning.details?.includes("source-map-loader");
      },
    ];

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^tempa-xlsx$/,
        "../../../../../node_modules/xlsx/dist/xlsx.mini.min.js",
      ),
      new webpack.NormalModuleReplacementPlugin(/^xlsx$/, "../../../node_modules/xlsx/dist/xlsx.mini.min.js"),
      new MomentLocalesPlugin({
        localesToKeep: ["id"],
      }),
      ...(process.env.NODE_ENV === "production"
        ? [
            new webpack.DefinePlugin({
              __SENTRY_DEBUG__: false,
              __SENTRY_TRACING__: false,
            }),
          ]
        : []),
      sentryWebpackPlugin({
        org: "absendulu",
        project: "admin",
        runOnce: true,
        debug: process.env.NODE_ENV !== "production",
        disable: process.env.NODE_ENV !== "production",

        // Specify the directory containing build artifacts
        sourcemaps: {
          assets: "./build/static/js/**",
        },

        // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // and needs the `project:releases` and `org:read` scopes
        authToken:
          "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",

        // Optionally uncomment the line below to override automatic release name detection
        release: {
          name: "ab-admin@" + (process.env.REACT_APP_BUILD_TIME_STAMP ?? ""),
          create: process.env.NODE_ENV === "production",
          deploy: {
            env: process.env.NODE_ENV,
          },
        },
      }),
    );

    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        new CompressionPlugin({
          filename: "[path][base].gz",
          algorithm: "gzip",
          test: /\.(js|css|html|cjs|mjs|json|png|gif|svg|eot|ttf|woff|woff2)$/,
          threshold: 5120,
          minRatio: 1,
        }),
        new CompressionPlugin({
          filename: "[path][base].br",
          algorithm: "brotliCompress",
          test: /\.(js|css|html|svg)$/,
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
            },
          },
          threshold: 5120,
          minRatio: 1,
        }),
        new CompressionPlugin({
          filename: "[path][base].br",
          algorithm: "brotliCompress",
          test: /\.(eot|ttf|woff|woff2)$/,
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_FONT,
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
            },
          },
          threshold: 5120,
          minRatio: 1,
        }),
      );
    }

    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
    );

    return config;
  },
);
