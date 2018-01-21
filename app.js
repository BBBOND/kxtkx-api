let express = require('express');
let app = express();
let index = require('./src/routes/index');
let bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use('/', index);

module.exports = app;