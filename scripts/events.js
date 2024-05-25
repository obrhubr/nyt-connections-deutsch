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

	let answers = Object.entries(categories).map(([k, v]) => {
		v.words.sort();
		if (selected.equals(v.words)) {
			return k;
		} else if (areOneAway(v.words, selected)) {
			return "oneaway";
		}
		return ;
	});
	// Remove undefined
	answerOneAway = answers.filter(item => item);
	answer = answerOneAway.filter(item => item !== "oneaway");
	
	if (answer.length == 1) {
		console.log("Solved category", answer[0])
		categories[answer[0]].solved = true;
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

function showResults() {
	// Add score visualisation
	let history = convertHistory();
	let steps = document.getElementById("steps");
	steps.innerHTML = "";
	for (let h = 0; h < history.length; h++) {
		console.log(h, history[h], history[h][0], history[h][1], history[h][2], history[h][3])
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

function gameEnd(success) {
	let mistakesContainer = document.getElementById("mistake-container");
	mistakesContainer.innerHTML = "";
	let buttons = document.getElementById("buttons");
	buttons.innerHTML = '<div onclick="showResults()" class="showresults button" id="showresults">Show Results</div>';

	if (success) {
	} else {
		Object.entries(categories).map(([k, v]) => {
			v.solved = true;
		});
		setup()
	}
};