const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const app = express();
var fs = require('fs'); // File System module (part of Node.js)

var guessedLetter = "";  // this will be the letter the user guesses
var rememGuess = [];     // this will be all the letters the user guessed

// Word Game voodoo
// goes to the computer dictionary and gets a random word
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
//console.log(words);  // Gets a crap-ton of words
var randomWord = words[Math.floor(Math.random() * words.length)]; // forgot where I found this...
var secretWord = randomWord;
console.log("the secretWord is:", randomWord);
var swArray = randomWord.split(""); // puts secret word in an array, letters separated by commas
console.log("secWord in array is:", swArray);
let displaySW = makeDashes(swArray); // call makeDashes function...use when comparing user guess?
let joinSW = makeDashes(swArray);
let displayableSW = joinSW.join(''); // to display dashes on screen the length of the word
console.log("displaySW;", displaySW);
console.log('displayableSW;', displayableSW);

// function to change the Secret Word into an array of dashes
function makeDashes(swArray) {
	var dashArray = [];
	for (i = 0; i < swArray.length; i++) {
		dashArray.push('_ ');
	}
	return dashArray;
};
//console.log("should be dashes;", makeDashes(swArray));
// end voodoo


// View Engine
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}))

// Set app to use Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
//'extended: false' parses strings and arrays.
//'extended: true' parses nested objects

//'expressValidator' must come after 'bodyParser', since data must be parsed first!
// app.use(expressValidator());

// Set Static Path (this is where my static resourses, like CSS files, images, etc reside)
app.use(express.static('public'));

app.use(function (req, res, next) {
	var views = req.session.views

	if (!views) {
		views = req.session.views = {}
	}

	// get the url pathname
	var pathname = parseurl(req).pathname

	// count the views
	views[pathname] = (views[pathname] || 0) + 1

	next()
})

app.get('/', function (req, res) {
	console.log(secretWord);
	res.render('index', {
		word: displayableSW
	});
});

// this allows the form and console to talk, when this hits I still want the mystery word to show
// these semi-work...gonna copy and make changes, saving in case
//app.post('/', function(req, res){
//	console.log(req.body.yourGuess);
//	var inputItem = req.body.yourGuess;
//	res.render('index', {
//		word: displayableSW, guessedLetters: guessedLetter
//	});
//	console.log("guessedLetter", guessedLetter);
//});
// end saved, semi-work
app.post('/', function(req, res){
	var inputItem = req.body.yourGuess;
	res.render('index', {
		word: displayableSW, guessedLetters: guessedLetter
	});
	console.log("guessedLetter", guessedLetter);
});


app.get('/foo', function (req, res, next) {
	res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res, next) {
	res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})

app.listen(3000, function () {
	console.log('word-game application listening on port 3000')
});
