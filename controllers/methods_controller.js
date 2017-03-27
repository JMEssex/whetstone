var Method = require('../models/method'),
    Exercise = require('../models/exercise')


////////// INTERFACE ACTIONS //////////

// INDEX
function index(req, res) {
  Method.find({}, function(err, methods) {
    if (err) throw err
    res.render('./user/methods_index.ejs', {
      methods: methods
    })
  })
}

// NEW
function newMethod(req, res) {
  res.render(`./admin/method_form.ejs`, {
    message: req.flash(`adminMessage`)
  })
}

// CREATE
function createMethod(req, res) {
  var newMethod = new Method(req.body)
  newMethod.save(function(err, method) {
    if (err) throw err
    res.redirect('/methods/'+ method.slug_url)
  })
}

// SHOW
function show(req, res) {
  var slug = req.params.slug_url
  Exercise.find({}, function(err, exercises) {
    if (err) throw err
    Method.findOne({slug_url: slug}, function(err, method) {
      if (err) throw err
      res.render('./user/methods_show.ejs', {
        exercises: exercises,
        method: method
      })
    })
  })
}

// EDIT
function editMethod(req, res) {
  var slug = req.params.slug_url
  Method.findOne({slug_url: slug}, function(err, method) {
    if (err) throw err
    res.render(`./admin/edit_method_form.ejs`, {
      message: req.flash(`adminMessage`),
      method: method,
      destroyMethod: destroyMethod
    })
  })
}

// UPDATE
function updateMethod(req, res) {
  var slug = req.params.slug_url

  Method.findOne({
    slug_url: slug
  }, function(err, updatedMethod) {
    if (err || !updatedMethod) throw err

    if (req.body.name) updatedMethod.name = req.body.name
    if (req.body.language) updatedMethod.language = req.body.language
    if (req.body.description) updatedMethod.description = req.body.description
    if (req.body.version_added) updatedMethod.version_added = req.body.version_added
    if (req.body.docs_url) updatedMethod.docs_url = req.body.docs_url

    updatedMethod.save(function(err, method) {
      if (err) throw err
      res.redirect(`/methods/${method.slug_url}`)
    })
  })
}

// DELETE
function destroyMethod(req, res) {

  var slug = req.params.slug_url

  Method.remove({slug_url: slug}, function(err) {

    if (err) res.json({message: `Could not delete Method b/c: ${err}`})

    res.redirect('/dashboard')
  })
}

////////// API ACTIONS //////////

function indexJSON (req, res){
  Method.find({}, function(err, methods) {
    if (err) throw err
    res.json(methods)
  })
}

function showJSON (req, res){
  Method.findById(req.params.id, function(err, method) {
    if (err || !method) {
      res.json({message: 'No such method.'})
    } else {
    res.json(method)
    }
  })
}

function createJSON (req, res){
  var newMethod = new Method(req.body)
  newMethod.save(function(err, method) {
    if (err || !method) {
      res.json({message: 'Could not create method.'})
    } else{
      res.json(method)
    }
  })
}

function updateJSON(req, res) {
  Method.findById(req.params.id, function(err, updatedMethod) {
    if (err || !updatedMethod) res.json({message: 'No such method.'})

    if (req.body.name) updatedMethod.name = req.body.name
    if (req.body.language) updatedMethod.language = req.body.language
    if (req.body.description) updatedMethod.description = req.body.description
    if (req.body.version_added) updatedMethod.version_added = req.body.version_added
    if (req.body.docs_url) updatedMethod.docs_url = req.body.docs_url
    if (req.body.slug_url) updatedMethod.slug_url = req.body.slug_url

    updatedMethod.save(function(err, method) {
      if (err) res.json({message: 'Update method failed.'})
      res.json(method)
    })
  })
}

function destroyJSON (req, res){
  if (String(req.delete) === 'false') res.json({message: 'Delete key was set to false.'})
  Method.remove({_id: req.params.id}, function(err) {
    if (err) res.json({message: 'Unable to delete method.'})
    res.json({message: 'Method deleted.'})
  })
}

// EXPORTS
module.exports = {
  index: index,
  show: show,
  newMethod: newMethod,
  createMethod: createMethod,
  editMethod: editMethod,
  updateMethod: updateMethod,
  destroyMethod: destroyMethod,


  indexJSON: indexJSON,
  showJSON: showJSON,
  createJSON: createJSON,
  updateJSON: updateJSON,
  destroyJSON: destroyJSON

}
