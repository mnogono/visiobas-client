var express = require("express");
var fs = require('fs');

var router = express.Router();

router.get("/", function(req, res) {
	fs.readFile(__dirname + "../../index.html", {encoding: "utf-8"}, function(err, data) {
		if (err) {
			return res.send(err.message);
		}
		
		res.send(data);
	});		
});

module.exports = router;
