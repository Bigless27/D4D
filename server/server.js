var express = require('express');
var app = express();
var api = require('./api/api');
var auth = require('./auth/authRoutes')
var config = require('./config/config');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport')
var logger = require('./util/logger');


// db.url is different depending on NODE_ENV


require('./auth/oauth/passport')(passport)

mongoose.Promise = global.Promise
mongoose.connect(config.db.url);

if (config.seed) {
  require('./util/seed');
}
// setup the app middlware
require('./middleware/appMiddleware')(app);



app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, './../index.html'))
})


app.use('/api', api);
app.use('/auth', auth);
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));
app.use('/vendor', express.static(path.join(__dirname, '../vendor')))
app.use('/build', express.static(path.join(__dirname, '../build')))
app.use('/parallax', express.static(path.join(__dirname, '../parallax')))
app.use('/profile.html', express.static(path.join(__dirname, '../profile.html')))
app.use('/app', express.static(path.join(__dirname, '../app')))



app.use(function(err, req, res, next) {
  // if error thrown from jwt validation check
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
    return;
  }

  logger.error(err.stack);
  res.status(500).send('Oops');
});


// export the app for testing
module.exports = app;