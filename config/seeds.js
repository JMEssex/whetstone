// Our database file needs access to the environment variables, but this file is run outside of our app.  So we must require dotenv seperately.
// Load env variable from .env file
require('dotenv').config()

var mongoose = require('./database'),
	Test = require('../models/test'),
	Exercise = require('../models/exercise'),
	User = require('../models/user'),
	Method = require('../models/method')

var methods = [{
	name: 'search',
	language: 'JavaScript',
	version_added: 'JavaScript 1.2',
	description: 'This method can be applied to any string and takes a string or regular expression as an argument. It returns the index of the first match, or -1 if there is no match.',
	docs_url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search',
	slug_url: 'String-search'
},
{
	name: 'map',
	language: 'JavaScript',
	version_added: 'JavaScript 1.6',
	description: 'This method is passed to arrays, and takes a current value, starting index, and a callback as arguments. It returns a new array, made by running the callback on the initial array.',
	docs_url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
	slug_url: 'Array-map'
}
]

var fixedMethod = new Method({
	name: 'fundamentals',
	language: 'JavaScript',
	version_added: 'none',
	description: 'Exercises associated with this method are not specific to any method - just JavaScript fundamentals.',
	slug_url: 'JS-fundamentals'
})

var exercises = [
{	name: 'dashType',
	// enter the method name, the seeds file will take care of finding the id
	method: fixedMethod.id,
	difficulty: 4,
	prompt: 'Given a single dash as a string, return its type as a string - "em", "en", or "hyphen".',
	tests: [
		{
			explanation: 'Testing the three basic types, should return em.',
			invocation: "dashType('—')",
			expectation: 'em'
		},
		{
			explanation: 'Testing the three basic types, should return en.',
			invocation: "dashType('-')",
			expectation: 'en'
		}
	]
},
{	name: 'hello',
	// enter the method name, the seeds file will take care of finding the id
	method: fixedMethod.id,
	difficulty: 1,
	prompt: 'Write a function which takes a name as an argument, and returns "Hello, <name>." - or just "Hello." if no name is given.',
	tests: [
		{
			explanation: 'Test without name.',
			invocation: "hello()",
			expectation: 'Hello.'
		},
		{
			explanation: 'Test with name.',
			invocation: "hello('Bob')",
			expectation: 'Hello, Bob.'
		},
		{
			explanation: 'Test with longer name.',
			invocation: "hello('David Foster Wallace')",
			expectation: 'Hello, David Foster Wallace.'
		},
		{
			explanation: 'Test with random string.',
			invocation: "hello('fasdfa124isbi45')",
			expectation: 'Hello, fasdfa124isbi45.'
		},
	]
},
{	name: 'reverseString',
	// enter the method name, the seeds file will take care of finding the id
	method: fixedMethod.id,
	difficulty: 1,
	prompt: 'Complete the solution so that it reverses the string value passed into it.',
	tests: [
		{
			explanation: 'Test with short word',
			invocation: "reverseString('bat')",
			expectation: 'tab'
		},
		{
			explanation: 'Test with medium word.',
			invocation: "reverseString('Crazy')",
			expectation: 'yzarC'
		},
		{
			explanation: 'Test with longer word.',
			invocation: "reverseString('Hippopotamus')",
			expectation: 'sumatopoppiH'
		}

	]
}
]


Exercise.remove({}, function(err) {
    if (err) throw err
    console.log('Cleared exercises.')
    Method.remove({}, function(err) {
        if (err) throw err
        console.log('Cleared methods.')
        Method.create(methods, function(err, methods) {
            if (err) throw err
            fixedMethod.save()
            console.log(`Seeded ${methods.length + 1} methods.`)
            Exercise.create(exercises, function(err, exercises) {
                if (err) throw err
                console.log(`Seeded ${exercises.length} exercises.`)
        // Close connection and exit
                mongoose.connection.close()
                process.exit()

})})})})
