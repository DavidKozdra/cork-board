// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", require("./routes/routes.js"));

const dbo = require("./dbcon");

app.listen(port, () => {
	// perform a database connection when server starts
	dbo.connectToServer(function (err) {
		if (err) console.error(err);
	});

	console.log(
		`Success! Your application is running on port new connection ${port}.`
	);
});
