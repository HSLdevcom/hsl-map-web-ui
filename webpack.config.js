/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const modulesValues = require("postcss-modules-values");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function getDevtool(env) {
    return (env === "development") ? "eval" : "cheap-module-source-map";
}

function getEntry(env) {
    if (env === "development") {
        return [
            "webpack-dev-server/client?http://0.0.0.0:3000",
            "webpack/hot/only-dev-server",
            "react-hot-loader/patch",
            "babel-polyfill",
            "whatwg-fetch",
            "./src/index",
        ];
    }
    return [
        "babel-polyfill",
        "whatwg-fetch",
        "./src/index",
    ];
}

function getPlugins(env) {
    if (env === "development") {
        return [
            new webpack.DefinePlugin({
                "process.env": { NODE_ENV: JSON.stringify("development") },
            }),
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({ template: "index.ejs" }),
        ];
    }
    return [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": { NODE_ENV: JSON.stringify("production") },
        }),
        new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false } }),
        new HtmlWebpackPlugin({ template: "index.ejs" }),
    ];
}

module.exports = {
    bail: process.env.NODE_ENV !== "development",
    devtool: getDevtool(process.env.NODE_ENV),
    entry: getEntry(process.env.NODE_ENV),
    plugins: getPlugins(process.env.NODE_ENV),
    resolve: {
        modulesDirectories: ["node_modules", "src"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/kuljettaja/",
        filename: "bundle.js",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ["babel"],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loaders: ["style", "css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]", "postcss"],
                exclude: [
                    path.join(__dirname, "node_modules", "leaflet"),
                    path.join(__dirname, "node_modules", "leaflet.fullscreen")],
            },
            {
                test: /\.css$/,
                loaders: ["style", "css", "postcss"],
                include: [
                    path.join(__dirname, "node_modules", "leaflet"),
                    path.join(__dirname, "node_modules", "leaflet.fullscreen")],

            },
            {
                test: /\.svg$/,
                loader: "url-loader?mimetype=image/svg+xml",
            },
            {
                test: /\.png$/,
                loader: "url-loader",
                query: { mimetype: "image/png" },
            },
        ],
    },
    postcss: [modulesValues, autoprefixer],
};
