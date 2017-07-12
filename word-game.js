const express = require('express');
const parseurl = require('parseurl');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const gamedata = require('./gamedata'); // calling objects from gamedata.js

let title = 'Mystery Word';
var guessedLetter = ''; // this will be the letter the user guesses
const rememGuess = []; // this will be all the letters the user guessed
var guessLeft = 8;

// Word Game voodoo
let randomWord = gamedata.randomWord;
var secretWord = randomWord;
console.log("voodoo.randomWord:", randomWord);
var swArray = randomWord.split(""); // puts secret word in an array, letters separated by commas
//console.log("voodoo.swArray:", swArray);
let displaySW = gamedata.makeD(swArray);
let joinSW = gamedata.makeD(swArray);
let displayableSW = joinSW.join(''); // display dashes on screen the length of the word
console.log("voodoo.displayableSW:", displayableSW);
// end voodoo

const app = express();

// Set app to use Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
//'extended: false' parses strings and arrays.
//'extended: true' parses nested objects

//'expressValidator' must come after 'bodyParser', since data must be parsed first!
app.use(expressValidator());

// View Engine
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(session({
	secret: 'puckHead cat',
	resave: false,
	saveUninitialized: true
}))

// Set Static Path (this is where my static resourses, like CSS files, images, etc reside)
app.use(express.static('public'));

// Session Authentication
//app.use(function (req, res, next) {
//	var views = req.session.views
//
//	if (!views) {
//		views = req.session.views = {}
//	}
//
//	// get the url pathname
//	var pathname = parseurl(req).pathname
//
//	// count the views
//	views[pathname] = (views[pathname] || 0) + 1
//
//	next()
//})

// this is the start of the game...
app.get('/', function (req, res) {
	guessString = '';
	//	incorrGuesses = '';
	res.render('index', {
		title: title,
		word: displayableSW,
		remaining: guessLeft
	});
	console.log("app.get.displayableSW:", displayableSW);
});

// this allows the form and console to talk
app.post('/', function (req, res) {
	guessedLetter = req.body.yourGuess.toLowerCase();
	//	rememGuess.push(guessedLetter.toLowerCase());
	//	console.log("app.post.rememGuess:", rememGuess);
	req.checkBody('yourGuess', "Please enter one letter").notEmpty().isLength({
		min: 0,
		max: 1
	}).isAlpha();

	var errors = req.validationErrors();
	//	console.log("app.post.guessedLetter:", guessedLetter);
	if (errors) {
		// Render validation error messages
		res.render('gameplay', {
			word: displayableSW,
			errors: errors,
			guessedLetters: rememGuess,
			remaining: guessLeft
		});
		console.log("app.post.errors:", errors);
	} else {
		rememGuess.push(guessedLetter.toLowerCase());
		let guess = gamedata.isNewLetter(guessedLetter, guessedLetter)
//		console.log("app.post.guess:", guess);
		console.log("app.post.guessedLetter:", guessedLetter);
		console.log("app.post.rememGuess:", rememGuess);
		res.render('gameplay', {
			word: displayableSW,
			guessedLetters: rememGuess,
			remaining: guessLeft
		});
		console.log("app.post.displayableSW:", displayableSW);
	}
});


app.listen(3000, function () {
	console.log('word-game application listening on port 3000')
});
