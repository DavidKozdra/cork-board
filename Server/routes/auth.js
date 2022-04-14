var express = require("express")

var AuthLoginRoute = express.Router()

// This will help us connect to the database
const dbo = require("../dbcon")
const { default: session } = require("../session")

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId

// This section will login a user.
AuthLoginRoute.get("/login", session, async function (req, res) {
    let db_connect = dbo.getDb("corkboard")
    let { name, password } = req.query
    if (!name || !password) {
        res.status(401)
        res.json({ error: "missing username or password" })
    }
    let userobj = await db_connect
        .collection("users")
        .findOne({ name: name, password: password })
    if (!userobj) {
        res.json({ error: "user not found" })
        res.status(500)
        return
    }
    req.session.user = { name: userobj.name }
    await req.session.save()
    res.redirect("/")
})

AuthLoginRoute.get("/debug", session, async function (req, res) {
    res.json({ loggedin: req.session !== undefined, data: req.session })
})

AuthLoginRoute.get("/logout", session, async function (req, res) {
    if (req.session !== undefined) {
        req.session.destroy()
    }
    res.json({ error: null })
})

module.exports = AuthLoginRoute
