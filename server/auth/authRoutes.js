var router = require('express').Router();
var verifyUser = require('./auth').verifyUser;
var verifyUserRoute = require('./auth').verifyUserRoute;
var createToken = require('./auth').signToken;
var controller = require('./authController');
var passport = require('passport')

// before we send vack a jwt, lets check
// the password and username mathch what is in the DB
router.post('/signin', verifyUser(), controller.signin);

router.post('/authenticate', verifyUserRoute())


router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', function(req, res, next) {
	passport.authenticate('google', function(err, user, info) {
		if (err) {return next(err)}

		if(user) {
			var token = createToken(user._id)
			return res.redirect('/profile.html#/main?access_token=' + token)
		}
		else{
			return res.redirect('/#/login')
		}
	})(req, res, next);
})

router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/facebook/callback', function(req, res, next) {
	passport.authenticate('facebook', function(err, user, info) {
		if (err) {return next(err)}

		if(user) {
			var token = createToken(user._id)
			return res.redirect('/profile.html#/main?access_token=' + token)
		}
		else{
			return res.redirect('/#/login')
		}
	})(req, res, next);
})

router.get('logout', function(req, res) {
	req.logout();
	res.redirect('/')
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}

module.exports = router;
