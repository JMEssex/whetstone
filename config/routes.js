
var express = require('express'),
    router = express.Router(),
// Parses information from POST
    bodyParser = require('body-parser'),
// Used to manipulate POST methods
    methodOverride = require('method-override'),
    passport = require("passport")

// Require controllers
var usersController = require('../controllers/users_controller'),
    methodsController = require('../controllers/methods_controller'),
    exercisesController = require('../controllers/exercises_controller'),
    staticPagesController = require('../controllers/static_pages_controller'),
    completedExercisesController = require('../controllers/completed_exercises_controller')

// Routes helpers
function authenticateUser(request, response, next) {
  // If the user is authenticated, then we continue to the next function
  if (request.isAuthenticated()) return next()
  // If not, redirect them to the login page
  response.redirect('/')
}

function authenticateAdmin(request, response, next) {
  // If the user is authenticated and has admin access, continue to the next function
  if (request.isAuthenticated() && (request.user.local && request.user.local.isAdmin)) return next()
  // If not, redirect them to their dashboard
  response.redirect('/dashboard')
};

////////// ROUTES //////////

// Root path
router.get('/', function(request, response){
	response.render('./static_pages/index.ejs')
})

// Static Pages

router.route('/about')
	.get(staticPagesController.about)

// Authentication Routes

router.route('/signup')
  .get(usersController.getSignup)
  .post(usersController.postSignup)

router.route('/login')
  .get(usersController.getLogin)
  .post(usersController.postLogin)

router.route('/logout')
  .get(usersController.getLogout)

// route for facebook authentication and login
router.route('/auth/facebook')
  .get(usersController.getFacebook)

// handle the callback after facebook has authenticated the user
router.route('/auth/facebook/callback')
  .get(usersController.getFacebookCallback)


// User Routes

router.route('/dashboard')
	.get(authenticateUser, usersController.dashboard)

router.route('/exercises')
	// .get(authenticateUser, usersController.exercises)
	.get(authenticateUser, usersController.exercises)
	.post(usersController.runCode)

router.route('/completed-exercises')
  .post(completedExercisesController.create)



router.route('/profile')
  .get(authenticateUser, usersController.showProfile)

router.route('/profile/edit')
  .get(authenticateUser, usersController.editProfile)
  .post(authenticateUser, usersController.updateProfile)

router.route('/profile/delete')
  .post(authenticateUser, usersController.destroyUser)

// Method Routes
router.route('/methods')
  .get(authenticateUser, methodsController.index)

router.route('/methods/new')
  .get(authenticateAdmin,  methodsController.newMethod)
  .post(authenticateAdmin,  methodsController.createMethod)

router.route('/methods/:slug_url/edit')
  .get(authenticateAdmin,  methodsController.editMethod)
  .post(authenticateAdmin,  methodsController.updateMethod)

router.route('/methods/:slug_url/delete')
  .post(authenticateAdmin,  methodsController.destroyMethod)


router.route('/methods/:slug_url')
  .get(authenticateUser, methodsController.show)

// Exercises routes

router.route('/admin/exercises')
	.get(authenticateUser, exercisesController.index)


router.route('/exercises/new')
  .get(authenticateAdmin, exercisesController.newExercise)
  .post(authenticateAdmin, exercisesController.createExercise)

router.route('/exercises/:id/edit')
  .get(authenticateAdmin, exercisesController.editExercise)
  .post(authenticateAdmin, exercisesController.updateExercise)

router.route('/exercises/:id')
  .get(authenticateUser, exercisesController.show)

router.route('/exercises/:id/delete')
  .post(authenticateAdmin, exercisesController.destroyExercise)

module.exports = router
