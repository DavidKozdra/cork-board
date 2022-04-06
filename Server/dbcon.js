const { MongoClient } = require("mongodb");

// Server path
const url = "mongodb://" + process.env.CORK_MONGO_IP;

// declare mongo client
const client = new MongoClient(url, {
	useNewUrlParser: false,
	useUnifiedTopology: true,
});

// Name of the database
const dbname = "corkboard";

var _db;

module.exports = {
	connectToServer: function (callback) {
		client.connect(function (err, db) {
			// Verify we got a good "db" object
			if (db) {
				_db = db.db(dbname);
				console.log("Successfully connected to MongoDB.");
			}
			return callback(err);
		});
	},

	getDb: function () {
		return _db;
	},
};
