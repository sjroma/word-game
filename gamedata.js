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


function checkLetter(req, string, wordArray){
  let chosenLetter = string;
  let count = 0;
  if(chosenLetter.length === 1){
    let letterCheck = wordArray.stringArr.find(function(lett){
      if(lett.letter === chosenLetter){
        lett.letterGuess = chosenLetter;
        req.session.failed = false;
      }
      else{
        count = count + 1;
        // console.log("This is the count insid the else block: " + count);
      }
    });
    // console.log("The count going into the bad letter array: " + count);
    if(count === wordArray.stringArr.length){
      req.session.failed = true;
    }
  }
  let countCorrectLetters = 0;
  for(let i = 0; i < wordArray.stringArr.length;i++){
    // console.log(wordArray.stringArr.length);
    if(wordArray.stringArr[i].letter === wordArray.stringArr[i].letterGuess){
      countCorrectLetters = countCorrectLetters + 1;
    }
  }
  if(countCorrectLetters === wordArray.stringArr.length){
    req.session.youWon = true;
  }
  // console.log("The count is: " +countCorrectLetters);
  return req.session
}
function checkGuess(req, string, wordArray) {
	
}

module.exports = {
	makeD: makeDashes,
	isNewLetter: isNew,
	randomWord: randomWord
}
