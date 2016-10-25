const express = require("express");
const config = require("./webpack.config");

const staticPath = config.output.path;
const app = express();

app
.use(express.static(staticPath))
.get("/*", (req, res) => {
    res.sendFile("index.html", {
        root: staticPath,
    });
})
.listen(3000, "0.0.0.0", (err) => {
    if (err) console.log(err);
    console.log("Listening at port 3000");
});

