//npm modules
const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// create the server
const app = express();
require('./app/routes/vapp1.routes.js')(app);
// add & configure middleware
const port = process.env.PORT;
const url = process.env.API_URL;
// tell the server what port to listen on
app.listen(port, () => {
  console.log('Listening on '+url+':'+port)
}) 