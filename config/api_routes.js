var express = require('express'),
    router = express.Router(),
// Parses information from POST
    bodyParser = require('body-parser'),
// Used to manipulate POST methods
    methodOverride = require('method-override')

// Require controllers
var methods = require('../controllers/methods_controller'),
    exercises = require('../controllers/exercises_controller')

// API authentication

function checkStandardKey(req, res, next) {
  if (req.body.client_key == "123456789") return next()
  res.json({message:"Invalid client key."})
}

function checkAdminKey(req, res, next) {
  if (req.body.client_key == "adminkey") return next()
  res.json({message:"Invalid administrator key."})
};

////////// API ROUTES //////////

// All of these routes are namespaced to begin with /api/

// Root path
router.get('/', function(req, res){
	res.json({message: "Welcome to the Whetstone API! For a full list of API endpoints, visit https://github.com/WDI-project-3/whetstone."})
})

// Method CRUD
router.route('/methods')
  .get(methods.indexJSON)
  .post(checkStandardKey, methods.createJSON)

router.route('/methods/:id')
  .get(methods.showJSON)
  .patch(checkAdminKey, methods.updateJSON)

router.route('/methods-delete/:id')
  .post(checkAdminKey, methods.destroyJSON)

// Exercise CRUD
router.route('/exercises')
  .get(exercises.indexJSON)
  .post(checkAdminKey, exercises.createJSON)

router.route('/exercises/:id')
  .get(exercises.showJSON)
  .patch(checkAdminKey, exercises.updateJSON)

router.route('/exercises-delete/:id')
  .post(checkAdminKey, exercises.destroyJSON)


module.exports = router
