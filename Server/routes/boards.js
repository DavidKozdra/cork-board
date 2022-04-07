var express = require("express");

var boardRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../dbcon");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Collections:
// users
// boards
// posts

// This section will help you get a list of all the records.
boardRoutes.route("/").get(function (req, res) {
	let db_connect = dbo.getDb("corkboard");
	db_connect
		.collection("boards")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.status(200).json(result);
		});
});

// This section will help you get a single record by id
boardRoutes.route("/:id").get(function (req, res) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("boards").findOne(myquery, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
});

// This section will help you create a new record.
boardRoutes.route("/add").post(function (req, res) {
	let db_connect = dbo.getDb();

	//console.log("req: " + JSON.stringify(req.body));

	// put req params into object
	let board = {
        name: req.body.name,
        posts: req.body.posts,
        users: req.body.users,
        admin: req.body.admin,
        settings: req.body.settings,
	};


	// insert user into database
	db_connect.collection("boards").insertOne(boardObj, function (err, response) {
		if (err) throw err;
		res.json(response);
	});
});

// This section will help you update a record by id.
boardRoutes.route("/update/:id").post(function (req, res) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	let newvalues = {

		$set: {
            name: req.body.name,
            posts: req.body.posts,
            users: req.body.users,
            admin: req.body.admin,
            settings: req.body.settings,

		},
	};
	db_connect
		.collection("boards")
		.updateOne(myquery, newvalues, function (err, response) {
			if (err) throw err;
			//console.log("1 document updated");
			res.json(response);
		});
});

// This section will help you delete a record
boardRoutes.route("/remove/:id").delete((req, response) => {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("boards").deleteOne(myquery, function (err, obj) {
		if (err) throw err;
		console.log("1 document deleted");
		response.json(obj);
	});
});

module.exports = boardRoutes;
