var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// console.log(LocalStrategy.toString())

var User            = require('../models/user');

// require controllers
module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, callback) {
    User.findById(id, function(err, user) {
        callback(err, user);
    });
  });


passport.use('local-signup', new LocalStrategy({
	usernameField : 'email',
	passwordField : 'password',
	passReqToCallback : true
}, function(req, email, password, callback) {
	 process.nextTick(function() {

		 // Find a user with this e-mail
		 User.findOne({ 'local.email' :  email }, function(err, user) {
			 if (err) return callback(err);

			 // If there already is a user with this email
			 if (user) {
				 return callback(null, false, req.flash('signupMessage', 'This email is already used.'));
			 } else {
			 // There is no email registered with this email

				 // Create a new user
				 var newUser            = new User();
				 newUser.local.email    = email;
				 newUser.local.password = newUser.encrypt(password);

				 newUser.save(function(err) {
					 if (err) throw err;
					 return callback(null, newUser);
				 });
			 }
		 });
	 });
 }));


 passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, callback) {
		// Search for a user with this email
		 User.findOne({ 'local.email' :  email }, function(err, user) {
			 if (err) return callback(err);

				// If no user is found
			 if (!user) return callback(null, false, req.flash('loginMessage', 'No user found.'));

			 // Wrong password
			 if (!user.validPassword(password))     return callback(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

			 return callback(null, user);
		 });
	}));

	// =========================================================================
	   // FACEBOOK ================================================================
	   // =========================================================================
	   passport.use(new FacebookStrategy({

	       // pull in our app id and secret from our .env file
	       clientID        : process.env.FB_CLIENT_ID,
	       clientSecret    : process.env.FB_CLIENT_SECRET,
	       callbackURL     : process.env.FB_CALLBACK_URL,
	       profileFields   : ["emails", "displayName", "name"]
	   },

	   // facebook will send back the token and profile
	   function(token, refreshToken, profile, done) {

	       // asynchronous
	       process.nextTick(function() {

	           // find the user in the database based on their facebook id
	           User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

	               // if there is an error, stop everything and return that
	               // ie an error connecting to the database
	               if (err)
	                   return done(err);

	               // if the user is found, then log them in
	               if (user) {
	                   return done(null, user); // user found, return that user
	               } else {
	                   // if there is no user found with that facebook id, create them
	                   var newUser            = new User();

	                   // set all of the facebook information in our user model
	                   newUser.facebook.id    = profile.id; // set the users facebook id
	                   newUser.facebook.token = token; // we will save the token that facebook provides to the user
	                   newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
	                   newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
	                  //  console.log(profile)

	                   // save our user to the database
	                   newUser.save(function(err) {
	                       if (err)
	                           throw err;

	                       // if successful, return the new user
	                       return done(null, newUser);
	                   });
	               }

	           });
	       });
	   }));
	  //  =========================END FACEBOOK=====================================

}
