var mongoose = require('mongoose'),
	bcrypt   = require('bcrypt-nodejs'),
	CompletedExercise = mongoose.model('CompletedExercise')

// it's possible the name "method" isn't the best, we could
// consider changing it to function or something.
var userSchema = new mongoose.Schema({
	local : {
		email        : String,
		password     : String,
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	}
	completed_exercises: [CompletedExercise.schema]
})

User.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}

var User = mongoose.model('User', userSchema)

module.exports = User
