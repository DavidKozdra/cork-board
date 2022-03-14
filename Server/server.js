// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`Success! Your application is running on port new connection ${port}.`);
});