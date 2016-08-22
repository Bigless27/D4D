var express = require('express');
var app = express();
// var api = require('./api/api');
var config = require('./config/config');
var mongoose = require('mongoose');
var path = require('path');


// db.url is different depending on NODE_ENV


mongoose.Promise = global.Promise
mongoose.connect(config.db.url);

if (config.seed) {
  require('./util/seed');
}
// setup the app middlware
require('./middleware/appMiddleware')(app);

// // setup the api
// app.use('/api', api);

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, './../index.html'))
})

app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use('/vendor', express.static(path.join(__dirname, '../vendor')))
app.use('/js', express.static(path.join(__dirname, '../js')))
app.use('/css', express.static(path.join(__dirname, '../css')))
app.use('/parallax', express.static(path.join(__dirname, '../parallax')))
app.use('/login.html', express.static(path.join(__dirname, '../login.html')))
app.use('/img', express.static(path.join(__dirname, '../img')))


// set up global error handling
app.use(function(err, req, res, next) {
	console.log(err);
  res.status(500).send('Oops');
});


// export the app for testing
module.exports = app;