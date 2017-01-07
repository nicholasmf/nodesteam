var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

require('./models/profile.js');
require('./models/matches');
require('./models/userModel');

var routes = require('./routes/routes');
var passport = require('./passport/pass')();

var app = express();

// mongodb connection
mongoose.connect('mongodb://localhost/steamapi');

// Set view template to ejs
app.set('view engine', 'ejs');

app.use(express.static('./public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secword', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
//console.log(passport);
app.use(routes);

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
});