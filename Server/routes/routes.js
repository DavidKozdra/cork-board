var express = require("express")
var router = express.Router()

var usersRoute = require("./users")
var AuthLoginRoute = require("./auth")
var postRoutes = require("./posts")
var boardRoutes = require("./boards")

router.use(express.json())

router.get("/", function (req, res) {
    res.send("default route /")
})

router.use("/users", usersRoute)
router.use("/posts", postRoutes)
router.use("/auth", AuthLoginRoute)
router.use("/boards", boardRoutes)
router.use("/hello", require("./hello"))

module.exports = router
