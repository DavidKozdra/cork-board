var express = require("express")

var userRoutes = express.Router()


const bcrypt = require('bcrypt'); 
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
userRoutes.get("/", session, async function (req, res) {
    if (req.session.user == undefined) {
        res.json({ error: "not logged in" })
        res.status(500)
        express.redirect("/login")
        return
    }
    let db_connect = dbo.getDb("corkboard")
    db_connect
        .collection("users")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err
            res.status(200).json(result)
        })
})

// This section will help you get a single record by id
userRoutes.route("/:id").get(function (req, res) {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    db_connect.collection("users").findOne(myquery, function (err, result) {
        if (err) throw err
        res.json(result)
    })
})

// Validation functions
function validateName(username) {

    // check if user exists
    let db_connect = dbo.getDb()
    let myquery = { username: username }
    db_connect.collection("users").findOne(myquery, function (err, result) {
        if (err) throw err
        if (result) {
            return false
        } else {
            return true
        }
    })


    if (username.length > 64 || username.length < 3) return false

    return true
}

function validateEmail(email) {
    //validate email
    var emailRegex = new RegExp(
        "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    )
    
    // if email is used by another user
    let db_connect = dbo.getDb()
    let myquery = { email: email }

    //TODO make this async

    db_connect.collection("users").findOne(myquery, function (err, result) {
        if (err) throw err
        if (result) {
            return false
        } else {
            return true
        }
    })

    if (!email.includes(".")) return false

    if (!email.match(emailRegex)) return false
    return true
}

function validatePassword(password) {
    if (password.length > 64) return false

    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
    var passRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    )
    if (!password.match(passRegex)) return false

    return true
}

// This section will help you create a new record.
userRoutes.post("/add", session,async function (req, res) {
    let db_connect = dbo.getDb()

        //console.log("req: " + JSON.stringify(req.body));

    let hash;
    try {
        hash = await bcrypt.hash(req.body.password, saltRounds);


    } catch (err) { 
        res.json({ error: err })
        res.status(500)
        return
    }
    
    let userObj = {
        username: req.body.username,
        profile_pic: req.body.profile_pic,
        email: req.body.email,
        password: hash,
    }
    // validation
    if (!validateName(userObj.username))
        return res.status(401).send("error: username invalid")
    if (!validateEmail(userObj.email))
        return res.status(401).send("error: email invalid")
    if (!validatePassword(userObj.password))
        return res.status(401).send("error: password invalid")

    // insert user into database
    db_connect.collection("users").insertOne(userObj, function (err, response) {
        if (err) throw err
        res.json(response)
    })
})

// This section will help you update a record by id.
userRoutes.get("/update", session, async function (req, res) {
    if (req.session === undefined || req.session.user?.username === undefined) {
        res.status(401).json({
            message: "You are not logged in.",
        })
        return
    }
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.session.user.username) }

    // validation for new values
    if (req.body.username) {
        if (!validateName(req.body.username))
            return res.status(401).send("error: username invalid")
    }
    if (req.body.email) {
        if (!validateEmail(req.body.email))
            return res.status(401).send("error: email invalid")
    }
    if (req.body.password) {
        if (!validatePassword(req.body.password))
            return res.status(401).send("error: password invalid")
    }


    let newvalues = {
        $set: {
            username: req.body.username,
            profile_pic: req.body.profile_pic,
            email: req.body.email,
            password: req.body.password,
        },
    }
    db_connect
        .collection("users")
        .updateOne(myquery, newvalues, function (err, response) {
            if (err) throw err
            //console.log("1 document updated");
            res.json(response)
        })
})

// This section will help you delete a record
userRoutes.route("/remove").delete((req, response) => {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    db_connect.collection("users").deleteOne(myquery, function (err, obj) {
        if (err) throw err
        console.log("1 document deleted")
        response.json(obj)
    })
})

module.exports = userRoutes
