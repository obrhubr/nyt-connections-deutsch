let puzzles = [];

function getPuzzles() {
	db.collection("verbindungen")
	.orderBy("timestamp", "desc")
	.get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			let data = doc.data();
			data.id = doc.id;

			puzzles.push(data);
		});
		
		setupList();
	})
	.catch((error) => {
		alert("Error getting puzzle");
	});
}

function deletePuzzle(id) {
	db.collection('verbindungen').doc(id).delete();
}

function setupList() {
	let list = document.getElementById("list");
	list.innerHTML = "";

	puzzles.forEach(data => {
		let item = document.createElement("div");
		
		item.classList.add("item");
		item.id = data.id;
		item.innerHTML = 
			"<span class='bold'><a href='/?number=" + data.id + "'>#" + 
			data.id + 
			"</a></span><span>" + 
			data.author + 
			"</span><span>" + 
			new Date(data.timestamp).toLocaleString('de-DE', {year: 'numeric', month: '2-digit', day:'2-digit'}) + 
			"</span>"
		;

		if (firebase.auth().currentUser != null) {
			item.innerHTML +=
			`<button class="trash-button" onclick='deletePuzzle("` + data.id + `")'>` +
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">' +
            '<path d="M3 6h18v2H3zm2 2h14v12a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm5-4V2h4v2h5v2H3V4h5zm2 4h2v10h-2zm4 0h2v10h-2zm-8 0h2v10H8z"/>' +
        	'</svg>' +
			`</button>`;
		}

		list.appendChild(item);
	});
}

function init() {
	getPuzzles();
}