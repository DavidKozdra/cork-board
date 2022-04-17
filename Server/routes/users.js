var express = require("express")

var userRoutes = express.Router()

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
function validateName(name) {

    // check if user exists
    let db_connect = dbo.getDb()
    let myquery = { name: name }
    db_connect.collection("users").findOne(myquery, function (err, result) {
        if (err) throw err
        if (result) {
            return false
        } else {
            return true
        }
    })


    if (name.length > 64 || name.length < 3) return false

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
userRoutes.post("/add", session,function (req, res) {
    let db_connect = dbo.getDb()

    //console.log("req: " + JSON.stringify(req.body));

    // put req params into object
    let userObj = {
        username: req.body.username,
        profile_pic: req.body.profile_pic,
        email: req.body.email,
        password: req.body.password,
    }
    // validation
    if (!validateName(userObj.username))
        return res.status(401).send("error: name invalid")
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
userRoutes.route("/update/:id").post(function (req, res) {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    let newvalues = {
        $set: {
            name: req.body.name,
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
userRoutes.route("/remove/:id").delete((req, response) => {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    db_connect.collection("users").deleteOne(myquery, function (err, obj) {
        if (err) throw err
        console.log("1 document deleted")
        response.json(obj)
    })
})

module.exports = userRoutes
