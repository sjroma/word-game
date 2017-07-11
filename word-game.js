const express = require('express');
const parseurl = require('parseurl');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');

// calling objects from gamedata.js
const gamedata = require('./gamedata')

var guessedLetter = '';  // this will be the letter the user guesses
const rememGuess = [];  // this will be all the letters the user guessed
var guessLeft = 8;

// Word Game voodoo
let randomWord = gamedata.randomWord;
var secretWord = randomWord;
console.log("in declarations the secWord is:", randomWord);
var swArray = randomWord.split(""); // puts secret word in an array, letters separated by commas
console.log("in declarations secWord in array is:", swArray);

let displaySW = gamedata.makeD(swArray);
let joinSW = gamedata.makeD(swArray);
let displayableSW = joinSW.join(''); // display dashes on screen the length of the word
console.log("displaySW;", displaySW);
console.log('displayableSW;', displayableSW);
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
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}))

// Set Static Path (this is where my static resourses, like CSS files, images, etc reside)
app.use(express.static('public'));

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

// this should be the start of the game...
app.get('/', function (req, res) {
	console.log("in app.get", displayableSW);
	guessString = '';
	incorrGuesses = '';
	res.render('index', {
		word: displayableSW, remaining: guessLeft
	});
});

// this allows the form and console to talk, when this hits I still want the mystery word to show
// this is the game in progress
app.post('/', function(req, res) {
	guessedLetter = req.body.yourGuess.toLowerCase();
	req.checkBody('yourGuess', "Please enter one letter").notEmpty().isLength({min:0, max:1}).isAlpha();
	
	var errors = req.validationErrors();
	console.log("in app.post, guessInput:", guessedLetter);
  if (errors) {
    // Render validation error messages
    res.render('gameplay', {errors: errors});
		console.log("errors", errors);
  } else {
		let guess = gamedata.isNewLetter(guessedLetter, guessedLetter)
	res.render('gameplay', {
		word: displayableSW, guessedLetters: guessedLetter, remaining: guessLeft
	  });
	console.log("word-game app.post:", secretWord);
	console.log("app.post, guessedLetter", guessedLetter);
  }
});

app.get('gameplay', function(req,res) {
	guessedLetter = req.body.yourGuess.toLowerCase();
	req.checkBody('yourGuess', "Please enter one letter").notEmpty().isLength({min:0, max:1}).isAlpha();
	
	var errors = req.validationErrors();
	console.log("guessInput(gameplay.get):", guessedLetter);
  if (errors) {
    // Render validation error messages
    res.render('gameplay', {errors: errors});
		console.log("errors", errors);
  } else {
		let guess = gameplay.isNewLetter(guessedLetter, guessedLetter)
	res.render('gameplay', {
		word: displayableSW, guessedLetters: guessedLetter, remaining: guessLeft
    });
  }
});
		
app.post('gameplay', function(req,res) {
	guessedLetter = req.body.yourGuess.toLowerCase();
	req.checkBody('yourGuess', "Please enter one letter").notEmpty().isLength({min:0, max:1}).isAlpha();
	
	var errors = req.validationErrors();
	console.log("guessInput(gameplay.post):", guessedLetter);
  if (errors) {
    // Render validation error messages
    res.render('gameplay', {errors: errors});
		console.log("errors", errors);
  } else {
		let guess = gameplay.isNewLetter(guessedLetter, guessedLetter)
	res.render('gameplay', {
		word: displayableSW, guessedLetters: guessedLetter, remaining: guessLeft
    });
	}
});

//app.get('/foo', function (req, res, next) {
//	res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
//})
//
//app.get('/bar', function (req, res, next) {
//	res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
//})

app.listen(3000, function () {
	console.log('word-game application listening on port 3000')
});
