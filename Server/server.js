// server.js
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 5000
require("dotenv").config()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/", require("./routes/routes.js"))

const dbo = require("./dbcon")

async function start() {
    // perform a database connection when server starts
    await dbo.connectToServer()

    app.listen(port, function () {
        console.log(
            `Success! Your application is running on port new connection ${port}.`
        )
    })
}

start()
