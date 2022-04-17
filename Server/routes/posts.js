var express = require("express")

var postRoutes = express.Router()

// This will help us connect to the database
const dbo = require("../dbcon")

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
postRoutes.route("/add").post(function (req, res) {
    let db_connect = dbo.getDb()

    //console.log("req: " + JSON.stringify(req.body));

    // put req params into object
    let postObj = {
        header: req.body.header,
        pictures: req.body.pictures,
        reaction: req.body.reaction,
        authorid: req.body.authorid,
        datePosted: req.body.datePosted,
        expiration: req.body.expiration,
    }

    // insert user into database
    db_connect.collection("posts").insertOne(userObj, function (err, response) {
        if (err) throw err
        res.json(response)
    })
})

// This section will help you update a record by id.
postRoutes.route("/update/:id").post(function (req, res) {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    let newvalues = {
        $set: {
            header: req.body.header,
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
postRoutes.route("/remove/:id").delete((req, response) => {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    db_connect.collection("posts").deleteOne(myquery, function (err, obj) {
        if (err) throw err
        console.log("1 document deleted")
        response.json(obj)
    })
})

module.exports = postRoutes
