// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
require('dotenv').config();


// Calling the required MongoDB module.
const MongoClient = require("mongodb").MongoClient;

// Server path
const url = 'mongodb://' + process.env.CORK_MONGO_IP;

// Name of the database
const dbname = "corkboard";

MongoClient.connect(url, (err,client)=>{
  if(!err) {
     console.log("successful connection with the server");
  } else {
     console.log("Error in the connectivity");
     console.log(err);
  }
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`Success! Your application is running on port new connection ${port}.`);
});
