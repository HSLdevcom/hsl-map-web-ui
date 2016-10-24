const express = require("express");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");

const staticPath = config.output.path;
const environment = process.env.NODE_ENV || "development";
const app = express();

if (environment === "production") {
    app.use(express.static(staticPath))
    .get("/*", (req, res) => {
        res.sendFile("index.html", {
            root: staticPath,
        });
    })
    .listen(3000, "0.0.0.0", (err) => {
        if (err) console.log(err);
        console.log("Listening at port 3000");
    });
} else {
    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        historyApiFallback: true,
        stats: {
            colors: true,
        },
    })
    .listen(3000, "0.0.0.0", (err) => {
        if (err) console.log(err);
        console.log("Listening at port 3000");
    });
}

