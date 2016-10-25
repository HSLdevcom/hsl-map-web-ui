const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");

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
