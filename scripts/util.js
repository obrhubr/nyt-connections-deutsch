/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

function addOrRemove(array, value) {
	var index = array.indexOf(value);

	if (index === -1) {
		array.push(value);
	} else {
		array.splice(index, 1);
	}
}

// Warn if overriding existing method
if(Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array)
		return false;
	// if the argument is the same array, we can be sure the contents are same as well
	if(array === this)
		return true;
	// compare lengths - can save a lot of time 
	if (this.length != array.length)
		return false;

	for (var i = 0, l=this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i]))
				return false;       
		}           
		else if (this[i] != array[i]) { 
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;   
		}           
	}       
	return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

const delay = ms => new Promise(res => setTimeout(res, ms));

function areOneAway(list1, list2) {
	if (list1.length !== list2.length) {
		return false; // If the lengths are not equal, they can't be one away
	}

	let diffCount = 0;
	for (let i = 0; i < list1.length; i++) {
		if (list1[i] !== list2[i]) {
			diffCount++;
		}
		if (diffCount > 1) {
			return false; // If more than one difference is found, they are not one away
		}
	}

	return diffCount === 1; // If exactly one difference is found, they are one away
}

function copyTextToClipboard(text) {
	// Check if the Clipboard API is supported
	if (navigator.clipboard) {
		// Use the Clipboard API
		navigator.clipboard.writeText(text)
	} else {
		// Fallback for browsers that don't support the Clipboard API
		const textArea = document.createElement('textarea');
		textArea.value = text;

		// Make the textarea invisible
		textArea.style.position = 'fixed';
		textArea.style.left = '-9999px';

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			// Execute the copy command
			document.execCommand('copy');
		} catch (error) {
		}

		// Clean up
		document.body.removeChild(textArea);
	}
}

function convertHistory() {
	let history = [];

	for (let i = 0; i < tries.length; i++) {
		history.push([]);
		for (let w = 0; w < tries[i].length; w++) {		
			for (let c = 0; c < cNames.length; c++) {
				if (categories[cNames[c]].words.includes(tries[i][w].toLowerCase())) {
					// If the word is found in the category, return the category name
					history[i].push(cNames[c]);
				}
			};
		}
	}

	return history;
}

function getWords() {
	// Add only unsolved words to list
	words = [];
	for (let c = 0; c < cNames.length; c++) {
		if (!categories[cNames[c]].solved) {
			words.push(...categories[cNames[c]].words);
		};
	};
}

function shuffleWords() {
	getWords()
	shuffleArray(words);
	setup();
}

function copyResults() {
	let history = convertHistory();
	let text = "Verbindungen Puzzle: " + puzzleNumber + "\n";
	for (let h = 0; h < history.length; h++) {
		for (let el = 0; el < history[h].length; el++) {
			if (history[h][el] == "straightforward") {
				text += "🟨"
			} else if (history[h][el] == "medium") {
				text += "🟩"
			} else if (history[h][el] == "hard") {
				text += "🟦"
			} else if (history[h][el] == "tricky") {
				text += "🟪"
			};
		}
		text += "\n"
	};
	text += window.location.hostname + "/?number=" + puzzleNumber;

	copyTextToClipboard(text);
}

function getSolved() {
	let solveds = [];
	for (let c = 0; c < cNames.length; c++) {
		if (categories[cNames[c]].solved) {
			solveds.push(cNames[c]);
		};
	}
	
	// Remove undefined
	solveds = solveds.filter(item => item);

	return solveds;
}