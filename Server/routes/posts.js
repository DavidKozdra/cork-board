var express = require("express")

var postRoutes = express.Router()

// This will help us connect to the database
const dbo = require("../dbcon")
const { default: session } = require("../session")

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId

// Collections:
// users
// boards
// posts

// This section will help you get a list of all the records.
postRoutes.route("/").get(function (req, res) {
    let db_connect = dbo.getDb("corkboard")
    db_connect
        .collection("posts")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err
            res.status(200).json(result)
        })
})

// This section will help you get a single record by id
postRoutes.route("/:id").get(function (req, res) {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    db_connect.collection("posts").findOne(myquery, function (err, result) {
        if (err) throw err
        res.json(result)
    })
})

// This section will help you create a new record.
postRoutes.post("/add", session, async function (req, res) {
    let db_connect = dbo.getDb()
    if (req.session?.user === undefined) {
        res.status(401).json({
            message: "You are not logged in.",
        })
        return
    }

    let boardid = req.body.boardid

    let authCheck = await db_connect.collection("boards").findOne({
        _id: ObjectId(boardid),
        users: { $in: [req.session.user.username] },
    })
    if (authCheck === null) {
        res.status(403).json({
            message: "You don't have access to this board",
        })
        return
    }

    // put req params into object
    let postObj = {
        title: req.body.title,
        pictures: req.body.pictures,
        reaction: req.body.reaction,
        author: req.session.user.username,
        body: req.body.body,
        datePosted: req.body.datePosted,
        expiration: req.body.expiration,
        shape: {
            x: 1,
            y: 1,
            h: 4,
            w: 4,
        },
    }

    // insert user into database
    let result = await db_connect.collection("posts").insertOne(postObj)

    let board = await db_connect
        .collection("boards")
        .updateOne(
            { _id: new ObjectId(boardid) },
            { $push: { posts: result.insertedId } }
        )
    res.json({ post: postObj })
})

// This section will help you update a record by id.
postRoutes.route("/update/:id").post(function (req, res) {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    let newvalues = {
        $set: {
            title: req.body.title,
            pictures: req.body.pictures,
            reaction: req.body.reaction,
            authorid: req.body.authorid,
            datePosted: req.body.datePosted,
            expiration: req.body.expiration,
        },
    }

    db_connect
        .collection("posts")
        .updateOne(myquery, newvalues, function (err, response) {
            if (err) throw err
            //console.log("1 document updated");
            res.json(response)
        })
})

// This section will help you delete a record
postRoutes.post("/remove/:id", session, (req, response) => {
    if (req.session?.user === undefined) {
        res.status(401).json({
            message: "You are not logged in.",
        })
        return
    }

    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    db_connect.collection("posts").deleteOne(myquery, function (err, obj) {
        if (err) throw err
        console.log("1 document deleted")
        response.json(obj)
    })
})

module.exports = postRoutes
