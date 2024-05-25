let mistakes = 0;
let words = [];
let tries = [];
let selected = [];

// Lowercase all the words
Object.entries(categories).map(([k, v]) => {
	categories[k].words = v.words.map((x) => x.toLowerCase());
});

function metadataSetup() {
	let number = document.getElementById("number");
	number.innerHTML = "#" + metadata.number;
	let date = document.getElementById("date");
	date.innerHTML = metadata.date;
}

function setup() {
	// Get solved categories
	let solveds = Object.entries(categories).map(([k, v]) => {
		if (v.solved) {
			return k
		}
		return;
	});
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

function init() {
	metadataSetup();
	getWords();
	shuffleWords();
	setupMistakes();
}