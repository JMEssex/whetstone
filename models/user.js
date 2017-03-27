var mongoose = require('mongoose'),
	bcrypt   = require('bcrypt-nodejs'),
	CompletedExercise = require('./completed_exercise')

// it's possible the name "method" isn't the best, we could
// consider changing it to function or something.
var userSchema = new mongoose.Schema({
	local: {
    	title: { type: String, default: 'Chef' },
    	name: String,
		email: String,
		password: String,
		isAdmin: { type: Boolean, default: false }
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	completed_exercises: [CompletedExercise.schema]
})
userSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}

var User = mongoose.model('User', userSchema)

module.exports = User
