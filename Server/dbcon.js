const { MongoClient } = require("mongodb")

// Server path
const url = "mongodb://" + process.env.CORK_MONGO_IP
console.log("Connecting to MongoDB at " + url)

// declare mongo client
const client = new MongoClient(url, {
    useNewUrlParser: false,
    useUnifiedTopology: true,
})

// Name of the database
const dbname = "corkboard"

var _db
// TODO: Convert connectToServer to async/await so we can block until we have a db conn
module.exports = {
    connectToServer: async function () {
        let db = await client.connect()
        if (db) {
            _db = db.db(dbname)
            console.log("Successfully connected to MongoDB.")
        }
    },

    getDb: function () {
        return _db
    },
}
