function clickTile(idx) {
	if (selected.length == 4 && !document.getElementById(idx.toString()).classList.contains("selected")) {
		return;
	};

	let tile = document.getElementById(idx.toString());
	addOrRemove(selected, tile.innerText.toLowerCase());
	tile.classList.toggle("selected");

	let submit = document.getElementById("submit");
	if (selected.length == 4) {
		submit.addEventListener("click", submitCategory);
		submit.classList.toggle("active");
	} else {
		try {
			submit.removeEventListener("click", submitCategory)
		} catch {

		}
		submit.classList.remove("active");
	}
}

async function submitCategory() {
	// save history
	tries.push([...selected]);

	// Disable submit button during animations
	let submit = document.getElementById("submit");
	submit.classList.toggle("active");
	submit.removeEventListener("click", submitCategory);

	// show animation
	let s = document.getElementsByClassName("selected");
	for (let i = 0; i < s.length; i++) {
		s[i].classList.add("vertical-shake")
		await delay (200);
	}
	await delay (200);
	for (let i = 0; i < s.length; i++) {
		s[i].classList.remove("vertical-shake")
	}
	
	selected.sort();

	let answers = [];
	for (let c = 0; c < cNames.length; c++) {
		categories[cNames[c]].words.sort();
		if (selected.equals(categories[cNames[c]].words)) {
			answers.push(cNames[c]);
		} else if (areOneAway(categories[cNames[c]].words, selected)) {
			answers.push("oneaway");
		};
	};
	
	// Remove undefined
	answerOneAway = answers.filter(item => item);
	let answer = answerOneAway.filter(item => item !== "oneaway");
	
	if (answer.length == 1) {
		console.log("Solved category", answer[0])
		categories[answer[0]].solved = true;

		let solveds = getSolved();
		if (solveds.length == 4) {
			gameEnd(true);
		}

		setup();
	} else {
		// Check difference, if only one show "one away"
		if (answerOneAway.length > 0) {
			showWarning("Nur ein Fehler!");
		}

		mistakes++;
		setupMistakes();

		// show animation
		let s = document.getElementsByClassName("selected");
		for (let i = 0; i < s.length; i++) {
			s[i].classList.add("horizontal-shake")
		}
		await delay (500);
		for (let i = 0; i < s.length; i++) {
			s[i].classList.remove("horizontal-shake")
		}
	}
	
	// Activate submit again
	submit.classList.toggle("active");
	submit.addEventListener("click", submitCategory);
}

async function showWarning(warning) {
	let w = document.getElementById("warning");
	w.innerHTML = warning;
	w.classList.add("popup-open");
	
	await delay(1000);

	w.classList.remove("popup-open");
}

function showInstructions() {
	// Show popup
	let w = document.getElementById("instructions");
	w.classList.add("popup-open");
	let r = document.getElementById("all");
	r.classList.add("blurred");
}

function showResults() {
	// Add score visualisation
	let history = convertHistory();
	let steps = document.getElementById("steps");
	steps.innerHTML = "";
	for (let h = 0; h < history.length; h++) {
		let row = document.createElement("div");
		row.classList.add("steps-row");
		row.innerHTML = 
			"<div style='background-color:" + categories[history[h][0]].color + ";'>&nbsp;</div>" + 
			"<div style='background-color:" + categories[history[h][1]].color + ";'>&nbsp;</div>" + 
			"<div style='background-color:" + categories[history[h][2]].color + ";'>&nbsp;</div>" + 
			"<div style='background-color:" + categories[history[h][3]].color + ";'>&nbsp;</div>"
		;
		steps.appendChild(row);
	};

	// Show popup
	let w = document.getElementById("results");
	w.classList.add("popup-open");
	let r = document.getElementById("all");
	r.classList.add("blurred");
}

function closePopup(id) {
	console.log(id)
	let el = document.getElementById(id);
	el.classList.remove("popup-open");
	let r = document.getElementById("all");
	r.classList.remove("blurred");
}

function gameEnd(success) {
	// convert history to dictionary for firebase
	let history_dict = {}
	tries.forEach((el, index) => history_dict[index] = el);

	try {
		let stats = {
			userId: userId,
			timestamp: Date.now(),
			id: puzzleNumber,
			success: success,
			mistakes: mistakes,
			history: history_dict
		};
	
		analytics.logEvent('end', stats);
		db.collection("log").add(stats);
	
		// Log to logsnag
		let data = {
			"project": "verbindungen",
			"channel": "puzzles",
			"event": "finished",
			"description": success ? "A user solved a puzzle." : "A user failed a puzzle.",
			"icon": success ? "✅" : "❌",
			"notify": true,
			"tags": {
				"id": puzzleNumber,
				"success": success,
				"mistakes": mistakes
			}
		};
		fetch("https://api.logsnag.com/v1/log", {
			method: 'POST', // Specify the HTTP method
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${keys.logsnag}`
			},
			body: JSON.stringify(data), // Convert the JSON data to a string
		});
	} catch (e) {
		console.log("Error while logging stats: ", e)
	};

	let mistakesContainer = document.getElementById("mistake-container");
	mistakesContainer.innerHTML = "";
	let buttons = document.getElementById("buttons");
	buttons.innerHTML = '<div onclick="showResults()" class="showresults button" id="showresults">Show Results</div>';

	if (success) {
	} else {
		for (let c = 0; c < cNames.length; c++) {
			categories[cNames[c]].solved = true;
		};
		setup()
	}
};