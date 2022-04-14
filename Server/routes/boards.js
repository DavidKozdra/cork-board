var express = require("express")

var boardRoutes = express.Router()

// This will help us connect to the database
const dbo = require("../dbcon")
const { default: session } = require("../session")

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId

boardRoutes.use("/:id/posts", require("./posts"))

// Collections:
// users
// boards
// posts

const POSTS_LOOKUP = {
    $lookup: {
        from: "posts",
        localField: "posts",
        foreignField: "_id",
        as: "posts",
    },
}

// This section will help you get a list of all the records.
boardRoutes.get("/", session, async function (req, res) {
    if (req.session === undefined) {
        res.status(401).json({
            message: "You are not logged in.",
        })
        return
    }
    let db_connect = dbo.getDb("corkboard")

    let agg = [POSTS_LOOKUP]

    let results = await db_connect.collection("boards").aggregate(agg).toArray()
    res.status(200).json(results)
})

// This section will help you get a single record by id
boardRoutes.route("/:id").get(async function (req, res) {
    let db_connect = dbo.getDb()
    let agg = [
        {
            $match: {
                _id: new ObjectId(req.params.id),
            },
        },
        POSTS_LOOKUP,
    ]
    let results = await db_connect.collection("boards").aggregate(agg).next()
    res.json(results)
})

// This section will help you create a new record.
boardRoutes.post("/add", async function (req, res) {
    let db_connect = dbo.getDb()

    //console.log("req: " + JSON.stringify(req.body));

    // put req params into object
    let board = {
        name: req.body.name,
        posts: req.body.posts,
        users: req.body.users,
        admin: req.body.admin,
        settings: req.body.settings,
    }

    // insert user into database
    db_connect.collection("boards").insertOne(board, function (err, response) {
        if (err) throw err
        res.json(response)
    })
})

// This section will help you update a record by id.
boardRoutes.post("/update/:id", async function (req, res) {
    let db_connect = dbo.getDb()
    let myquery = { _id: new ObjectId(req.params.id) }
    let newvalues = {
        $set: {
            name: req.body.name,
            posts: req.body.posts,
            users: req.body.users,
            admin: req.body.admin,
            settings: req.body.settings,
        },
    }
    db_connect
        .collection("boards")
        .updateOne(myquery, newvalues, function (err, response) {
            if (err) throw err
            //console.log("1 document updated");
            res.json(response)
        })
})

// This section will help you delete a record
boardRoutes.delete("/remove/:id", async function (req, response) {
    let db_connect = dbo.getDb()
    let myquery = { _id: new ObjectId(req.params.id) }
    db_connect.collection("boards").deleteOne(myquery, function (err, obj) {
        if (err) throw err
        console.log("1 document deleted")
        response.json(obj)
    })
})

module.exports = boardRoutes
