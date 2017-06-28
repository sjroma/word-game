const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const app = express();
var fs = require('fs'); // File System module (part of Node.js)

//var guessedLetter = "";  // this will be the letter the user guesses
//var rememGuess = "";     // this will be all the letters the user guessed


const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
//console.log(words);  // Gets a crap-ton of words
var randomWord = words[Math.floor(Math.random() * words.length)];
var secretWord = randomWord.replace(/[A-Z]/g,"_");  // forgot where I found this...adding comments for future me too late
console.log("the word is:", randomWord);


// View Engine
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// Set app to use Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//'extended: false' parses strings and arrays.
//'extended: true' parses nested objects
//'expressValidator' must come after 'bodyParser', since data must be parsed first!
//app.use(expressValidator());

// Set Static Path (this is where my static resourses, like CSS files, reside)
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
  res.render('index');
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