var Exercise = require('../models/exercise'),
    Method = require('../models/method'),
    Test = require('../models/test')

// INDEX
function index(req, res) {
  Exercise.find({}, function(err, exercises) {
    if (err) throw err
    res.json(exercises)
  })
}

// NEW
function newExercise(req, res) {
  Method.find({}, function(err, methods) {
    if (err) throw err

  res.render(`./admin/exercise_form.ejs`,
    {
      methods: methods,
      message: req.flash(`adminMessage`)
    })
  })
}


// CREATE
function createExercise(req, res) {
  var newExercise = new Exercise(req.body)
  console.log(req.body)
  newExercise.save(function(err, exercise) {
    if (err) throw err
    res.redirect('/dashboard')
  })
}


// SHOW
function show(req, res) {
  var id = req.params.id

  Exercise.findById(id, function(err, exercise) {
    if(err) throw err
    res.render('./user/exercises', {
      exercise: exercise
    })
  })
}


// EDIT
function editExercise(req, res) {
  var id = req.params.id
  Method.find({}, function(err, methods){
    if (err) throw err

  Exercise.findById({_id: id}, function(err, exercise) {
    if (err) throw err
    res.render(`./admin/edit_exercise_form.ejs`,
      {
        message: req.flash(`adminMessage`),
        exercise: exercise,
        methods: methods,
        destroyExercise: destroyExercise
      })
    })
  })
}


// UPDATE
function updateExercise(req, res) {
  var id = req.params.id

  Exercise.findById({_id: id}, function(err, updatedExercise) {
    if (err || !updatedExercise) throw err

    if (req.body.name) updatedExercise.name = req.body.name
    if (req.body.method) updatedExercise.method = req.body.method
    if (req.body.difficulty) updatedExercise.difficulty = req.body.difficulty
    if (req.body.prompt) updatedExercise.prompt = req.body.prompt
    if (req.body.tests) updatedExercise.tests = req.body.tests

    updatedExercise.save(function(err, exercise) {
      if (err) throw err
      res.redirect('/exercises/'+ exercise.id)
    })
  })
}


// DELETE
function destroyExercise(req, res) {
  var id = req.params.id
  // var areYouSure = prompt(`ARE YOU SURE YOU WANT TO DELETE THIS METHOD?\nType: "YES DELETE METHOD"\n\n${req.body}`)
  // if (areYouSure === "YES DELETE METHOD") {

    Exercise.remove({_id: id}, function(err) {
      if (err) res.json( {message: `Could not delete Exercise b/c: ${err}`} )

      res.redirect('/dashboard')
    })

  // }
}

////////// API ACTIONS //////////

function indexJSON (req, res){  
  Exercise.find({})
          .populate('method') 
          .exec(function(err, exercises) {
            if (err) throw err
            res.json(exercises)
  })
}

function showJSON (req, res){  
  Exercise.findById(req.params.id)
          .populate('method') 
          .exec(function(err, exercise) {
            if (err || !exercise) {
              res.json({message: 'No such exercise.'})
            } else {
            res.json(exercise)
            }
  })
}

function createJSON (req, res){
  console.log('body', req.body)
  Method.find({slug_url: req.body.method}, function(err, method){
    if (err || !method) res.json({message: 'Could not find method.'})
    
    var newExercise = new Exercise(req.body)
    newExercise.method = method.id
    newExercise.save(function(err, exercise) {
      if (err || !exercise) {
        res.json({message: 'Could not create exercise.', error: err})
      } else {
        res.json(exercise)
      }
    })
  })
}

// function updateJSON (req, res){
//   res.json({message: 'hi'})
// }

function updateJSON(req, res) {
  Exercise.findById(req.params.id, function(err, exerciseToUpdate) {
    if (err || !exerciseToUpdate) res.json({message: 'Could not find exercise.'})

    // If the request is going to change the method, find the method first
    if (req.body.method) {
      Method.findOne({slug_url: req.body.method}, function(err, method){
        if (err || !method) {
          res.json({message: 'Could not find new method.', error: err})
        } else {

          exerciseToUpdate.method = method._id

          // update everything else, if it's specified
          if (req.body.name) exerciseToUpdate.name = req.body.name
          if (req.body.difficulty) exerciseToUpdate.difficulty = req.body.difficulty
          if (req.body.prompt) exerciseToUpdate.prompt = req.body.prompt
          if (req.body.tests) exerciseToUpdate.tests = req.body.tests

          exerciseToUpdate.save(function(err, exercise) {
            if (err) res.json({message: 'Could not update exercise.', error: err})
            res.json(exercise)
          })
        }
      })
    } else {

      if (req.body.name) exerciseToUpdate.name = req.body.name
      if (req.body.difficulty) exerciseToUpdate.difficulty = req.body.difficulty
      if (req.body.prompt) exerciseToUpdate.prompt = req.body.prompt

      // NOTE: If there are tests in the request, ALL of the current tests 
      // will be written over with the new tests.
      if (req.body.tests) exerciseToUpdate.tests = req.body.tests

      exerciseToUpdate.save(function(err, exercise) {
        if (err) res.json({message: 'Could not update exercise.', error: err})
        res.json(exercise)
      })
    }
  })
}

function destroyJSON (req, res){
  if (String(req.delete) === 'false') res.json({message: 'Delete key was set to false.'})
  Exercise.remove({_id: req.params.id}, function(err) {
    if (err) res.json({message: 'Unable to delete exercise.'})
    res.json({message: 'Exercise deleted.'})
  })
}




// EXPORTS
module.exports = {
  index: index,
  show: show,
  newExercise: newExercise,
  createExercise: createExercise,
  editExercise: editExercise,
  updateExercise: updateExercise,
  destroyExercise: destroyExercise,

  indexJSON: indexJSON,  
  showJSON: showJSON,  
  createJSON: createJSON,  
  updateJSON: updateJSON,  
  destroyJSON: destroyJSON
}
