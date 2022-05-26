const chalk = require("chalk");
const path = require("path");
const express = require("express");
const serveStatic = require("serve-static");
const proxy = require("express-http-proxy");

let app = express();
app.use(serveStatic(path.join(__dirname, "../../", "dist")));

app.use("/api", proxy("https://fefu-events-app.herokuapp.com/"));

const port = 8080;
app.listen(port, () => {
  var lines = process.stdout.getWindowSize()[1];
  console.log(
    chalk.bgHex("#6bbe7c").black(" DONE ") +
      chalk.hex("#6bbe7c")(" Server started successfully")
  );
  console.log("\n  App running at:");
  console.log("  - Local: " + chalk.hex("#73b4d8")("http://localhost:" + port));
  for (var i = 0; i < lines - 5; i++) {
    console.log("");
  }
});
