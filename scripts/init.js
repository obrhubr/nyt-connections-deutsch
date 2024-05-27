// Current game data
let categories = {};
let cNames = ["straightforward", "medium", "hard", "tricky"];
let puzzleNumber = "";

// Stat trackers
let mistakes = 0;
let words = [];
let tries = [];
let selected = [];

function metadataSetup(puzzleNumber) {
	let number = document.getElementById("number");
	number.innerHTML = "#" + puzzleNumber;
	let date = document.getElementById("date");
	date.innerHTML = new Date(categories.timestamp).toLocaleString('de-DE', {year: 'numeric', month: '2-digit', day:'2-digit'});
}

function setup() {
	// Get solved categories
	let solveds = [];
	for (let c = 0; c < cNames.length; c++) {
		if (categories[cNames[c]].solved) {
			solveds.push(cNames[c]);
		};
	}
	
	// Remove undefined
	solveds = solveds.filter(item => item);

	for (let s = 0; s < solveds.length; s++) {
		for (let w = 0; w < categories[solveds[s]].words.length; w++) {
			const index = words.indexOf(categories[solveds[s]].words[w]);
			if (index > -1) {
				words.splice(index, 1);
			};
		};
	};

	// Clear selected
	selected = [];

	// Setup solved tiles
	for (let idx = 1; idx <= solveds.length; idx++) {
		let row = document.getElementById("row" + idx.toString());
		row.innerHTML = 
		'<div style="background-color:' + categories[solveds[idx - 1]].color + ';" class="solved appear">' + 
			"<div class='categoryname'>" + 
			categories[solveds[idx - 1]].category + 
			"</div>" +
			"<div>" + 
			categories[solveds[idx - 1]].words.join(", ") + 
			"</div>" +
		"</div>";
	};

	// Setup all remaining tiles
	for (let idx = 1; idx <= words.length; idx++) {
		let tile = document.getElementById((solveds.length*4 + idx).toString());
		tile.classList.remove("selected");
		tile.innerText = words[idx - 1];
	};

	if (solveds.length == 4) {
		gameEnd(true);
	}
}

function setupMistakes() {	
	let counter = document.getElementById("mistakes");
	counter.innerHTML = "";

	for (let i = 4-mistakes; i > 0; i--) {
		let mistake = document.createElement("div");
		mistake.innerHTML = "&nbsp;";
		mistake.classList.add("mistake");

		counter.appendChild(mistake);
	}

	if (mistakes == 4) {
		gameEnd(false);
	}
}

function runSetup() {
	// Uppercase then lowercase all words to remove special characters
	for (let c = 0; c < cNames.length; c++) {
		categories[cNames[c]].words = categories[cNames[c]].words.map((x) => x.toUpperCase().toLowerCase());
	}
	
	// run DOM setup
	metadataSetup(puzzleNumber);
	getWords();
	shuffleWords();
	setupMistakes();
}

function init() {
	// Get puzzle number
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	if (hosted) {
		// load data
		puzzleNumber = urlParams.has('number') ? urlParams.get('number') : "";

		if (puzzleNumber == "") {
			db.collection("verbindungen").orderBy("timestamp", "desc").limit(1).get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let data = doc.data();
					puzzleNumber = doc.id;
	
					// Load data into variables
					categories = data;

					runSetup();
				});
			});
		} else {
			db.collection("verbindungen").doc(puzzleNumber).get()
			.then((doc) => {
				if (doc.exists) {
					let data = doc.data();
					puzzleNumber = doc.id;
	
					// Load data into variables
					categories = data;
				} else {
					window.location.replace("/");
				};

				runSetup();
			});
		}
	} else {
		puzzleNumber = 0;
		categories = {
			"straightforward": {
				"solved": false,
				"color": "rgb(249, 223, 109)",
				"category": "Dinge die man in einem Chemielabor findet", 
				"words": ["Binden", "Kittel", "Pipette", "Waage"]
			},
			"medium": {
				"solved": false,
				"color": "rgb(160, 195, 90)",
				"category": "___käse",
				"words": ["Frisch", "Hart", "Schnitt", "Reib"]
			},
			"hard": {
				"solved": false,
				"color": "rgb(176, 196, 239)",
				"category": "Begriffe aus der Schiffsfahrt",
				"words": ["Löschen", "Bereiten", "Stak", "Knoten"]
			},
			"tricky": {
				"solved": false,
				"color": "rgb(186, 129, 197)",
				"category": "Erste Wörter in James Bond Filmtiteln", 
				"words": ["Gold", "Liebesgrüße", "Lizenz", "Casino"]
			}
		};

		runSetup();
	}
}