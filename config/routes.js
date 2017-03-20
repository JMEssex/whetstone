var express = require('express');
var router = express.Router();
// Parses information from POST
var bodyParser = require('body-parser');
// Used to manipulate POST methods
var methodOverride = require('method-override');
var passport = require("passport");
var usersController = require('../controllers/users_controller');


// require controllers
var {index} = require('../controllers/methods_controller')


// root path
router.get('/', function(req,res){
	res.json({message:"Hello, World"})
})

function authenticateUser(req, res, next) {
  // If the user is authenticated, then we continue the execution
  if (req.isAuthenticated()) return next();

  // Otherwise the request is always redirected to the home page
  res.redirect('/');
}



router.route('/signup')
  .get(usersController.getSignup)
  .post(usersController.postSignup)

router.route('/login')
  .get(usersController.getLogin)
  .post(usersController.postLogin)

router.route("/logout")
  .get(usersController.getLogout)

	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	router.route("/auth/facebook")
	  .get(usersController.getFacebook)

	// handle the callback after facebook has authenticated the user
	router.route("/auth/facebook/callback")
	  .get(usersController.getFacebookCallback)

	// =======END FACEBOOK ROUTES===========

router.route("/secret")
  .get(authenticateUser, usersController.secret)





module.exports = router
