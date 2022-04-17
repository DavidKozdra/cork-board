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
    if (req.session === undefined || req.session.user?.username === undefined) {
        res.status(401).json({
            message: "You are not logged in.",
        })
        return
    }
    let db_connect = dbo.getDb("corkboard")

    let agg = [
        {
            $match: {
                users: { $in: [req.session.user.username] },
            },
        },
        POSTS_LOOKUP,
    ]

    let results = await db_connect.collection("boards").aggregate(agg).toArray()
    res.status(200).json(results)
})

// This section will help you get a single record by id
boardRoutes.get("/:id", session, async function (req, res) {
    if (req.session?.user === undefined) {
        res.json({})
        return
    }

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

    for (let i of results.posts) {
        if (i.author !== req.session.user.username) {
            i.shape.static = true
        }
    }

    res.json(results)
})

// This section will help you create a new record.
boardRoutes.post("/add", session, async function (req, res) {
    let db_connect = dbo.getDb()

    if (req.session?.user === undefined) {
        res.status(401)
        res.json({})
        return
    }

    let board = {
        name: req.body.name,
        posts: req.body.posts,
        users: req.body.users,
        admin: req.session.user.username,
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
            res.json(response)
        })
})

// This section will help you delete a record
boardRoutes.post("/remove/:id", async function (req, response) {
    let db_connect = dbo.getDb()
    let myquery = { _id: new ObjectId(req.params.id) }
    db_connect.collection("boards").deleteOne(myquery, function (err, obj) {
        if (err) throw err
        console.log("1 document deleted")
        response.json(obj)
    })
})

// This section will help you get a list of all the records.
boardRoutes.post(
    "/:id/posts/:postid/updatepost",
    session,
    async function (req, res) {
        if (req.session === undefined) {
            res.status(401).json({
                message: "You are not logged in.",
            })
            return
        }

        let db_connect = dbo.getDb("corkboard")

        let post = await db_connect
            .collection("posts")
            .findOne({ _id: new ObjectId(req.body.id) })
        //find author of this post with id

        if (
            req.session.user.username !==
            post.author /* && req.session.user.username != req.body.admin*/
        ) {
            res.status(401).json({
                message: "You are not authorized to do this.",
            })
            return
        }

        let gridData = req.body.gridData
        let result = await db_connect.collection("posts").findOneAndUpdate(
            { _id: new ObjectId(req.body.id) },
            {
                $set: {
                    shape: {
                        w: gridData.w,
                        h: gridData.h,
                        x: gridData.x,
                        y: gridData.y,
                    },
                },
            }
        )
        res.status(200).json(result.value)
    }
)

module.exports = boardRoutes
