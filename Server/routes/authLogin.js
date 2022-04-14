var express = require("express")

var AuthLoginRoute = express.Router()

// This will help us connect to the database
const dbo = require("../dbcon")
const { default: session } = require("./ironSession")

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId


// This section will login a user.
AuthLoginRoute.get("/login", session, async function (req, res) {
    console.log(req.body, req.params, req.query)
    let db_connect = dbo.getDb("corkboard")
    var userobj = await (db_connect
        .collection("users")
        .findOne({name: req.params.name, password: req.params.password}))
    if (!userobj) {
        res.json({"error": "user not found"})
        res.status(500)
        return
    }
    req.session.user = {name: userobj.name};
    await req.session.save()
})

AuthLoginRoute.get("/current", session , async function (req, res) {
    if (req.session.user === undefined) {
        res.json({"loggedin": false})
    } else {
        res.json({"loggedin": true, "user": req.session.user})
    }
})


AuthLoginRoute.get("/logout", session , async function (req, res) {
    req.session.destroy()
    res.json({"status": "success"})
})

module.exports = AuthLoginRoute