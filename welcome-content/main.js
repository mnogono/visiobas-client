var bodyParser = require("body-parser");
var handlebars = require("handlebars");
var express = require("express");
var path = require("path");
//var express_handlebars = require("express-handlebars");
var app = express();
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/svg", express.static(path.join(__dirname, "svg")));
app.use("/scenarios", express.static(path.join(__dirname, "scenarios")));
//app.engine(".html", express_handlebars({defaultLayout: "single", extname: ".html"}));
app.set("view engine", ".html");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//var router = express.Router();
app.use("/", require(__dirname + "/router/router.js"));

module.exports = app;
