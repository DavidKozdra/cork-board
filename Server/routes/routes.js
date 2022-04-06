var express = require("express");
var router = express.Router();

var usersRoute = require("./users");

router.use(express.json());

router.get("/", function (req, res) {
	res.send("default route /");
});

router.use("/users", usersRoute);
router.use("/hello", require("./hello"));

module.exports = router;
