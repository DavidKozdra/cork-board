// Calling the required MongoDB module.
const MongoClient = require("mongodb").MongoClient;

// Server path
const url = 'mongodb://' + process.env.CORK_MONGO_IP;

// Name of the database
const dbname = "corkboard";

var _db;
MongoClient.connect(url, (err, client) => {
    if (!err) {
        console.log("successful connection with the server");

        module.exports = {
            connectToServer: function (callback) {
                client.connect(function (err, db) {
                    // Verify we got a good "db" object
                    if (db) {
                        _db = db.db("employees");
                        console.log("Successfully connected to MongoDB.");
                    }
                    return callback(err);
                });
            },

            getDb: function () {
                return _db;
            },
        };

    } else {
        console.log("Error in the connectivity");
        console.log(err);
    }
})