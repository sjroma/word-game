var fs = require('fs'); // File System module (part of Node.js)

// goes to the computer dictionary and gets a random word
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
//console.log(words);  // Gets a crap-ton of words

var randomWord = words[Math.floor(Math.random() * words.length)];

// change Secret Word into array of dashes
function makeDashes(swArray) {
	var dashArray = [];
	for (i = 0; i < swArray.length; i++) {
		dashArray.push('_ ');
	}
	return dashArray;
};
//console.log("in gamedata.js dashes;", makeDashes(swArray));

// check if guess is a repeat letter
function isNew(letter, string) {
	let repeatGuess = false;
	if (string === '') {
		repeatGuess = false;
	} else {
		for (let i = 0; i < string.length; i++) {
			if (letter === string.charAt(i)) {
				repeatGuess = true;
				break;
			}
		}
	}
	return repeatGuess;
}


function checkGuess(req, string, wordArray) {

}


module.exports = {
	makeD: makeDashes,
	isNewLetter: isNew,
	randomWord: randomWord
}
