var express = require("express")

var AuthLoginRoute = express.Router()
const bcrypt = require('bcrypt'); 
const saltRounds = 10;         
// This will help us connect to the database
const dbo = require("../dbcon")
const { default: session } = require("../session")

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId

// This section will login a user.
AuthLoginRoute.post("/login", session, async function (req, res) {
    let db_connect = dbo.getDb("corkboard")
    let { username, password } = req.body
    if (!username || !password) {
        res.status(401)
        res.json({ error: "missing username or password" })
        return
    }

    let userobj = await db_connect
        .collection("users")
        .findOne({ username: username  })
    if (!userobj) {
        res.status(401)
        res.json({ error: "user not found" })
        return
    }
    hash = userobj.password;
    let result;

    try { 
        result = await bcrypt.compare(req.body.password, hash);
    } catch { 
                res.status(401)
                res.json({ error: "password does not match" })
                return
    }

    req.session.user = { username: userobj.username }
    await req.session.save()
    res.json({ isLoggedIn: !!req.session.user, ...req.session.user })
})

AuthLoginRoute.get("/session", session, async function (req, res) {
    res.json({ isLoggedIn: !!req.session.user, ...req.session.user })
})

AuthLoginRoute.post("/logout", session, async function (req, res) {
    if (req.session !== undefined) {
        req.session.destroy()
    }
    res.json({ isLoggedIn: false })
})

module.exports = AuthLoginRoute
