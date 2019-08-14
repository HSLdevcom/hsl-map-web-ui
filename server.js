/* eslint-disable import/no-extraneous-dependencies */
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");

const PORT = process.env.PORT || 3000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
  },
}).listen(PORT, "localhost", (err) => {
  if (err) console.log(err); // eslint-disable-line no-console
  console.log("Listening at port 3000"); // eslint-disable-line no-console
});
