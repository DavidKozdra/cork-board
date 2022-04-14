var express = require("express");
var ironSession = require("iron-session/express").ironSession;
require("dotenv").config()



exports.default = ironSession({
    cookieName: "CorkboardSession",
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
});
