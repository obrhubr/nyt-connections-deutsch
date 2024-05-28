function getPuzzleStats(id) {
	if (id == null) return;

	let mistakes = [];
	let successes = [];

	return db.collection("log")
	.where("id", "==", id)
	.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			let data = doc.data();
			
			if (data.success) {
				successes.push(doc.id);
			};
			mistakes.push(data.mistakes);
		});

		if (mistakes.length == 0) {
			return {
				"avgMistakes": 0,
				"successesPercent": 0,
				"attempts": 0
			}
		};
	
		return {
			"avgMistakes": mistakes.reduce((partialSum, a) => partialSum + a, 0) / mistakes.length,
			"successesPercent": (successes.length / mistakes.length * 100).toFixed(1),
			"attempts": mistakes.length
		};
	})
	.catch((error) => {
		alert("Error getting puzzle");
	});
};