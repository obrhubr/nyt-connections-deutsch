function backwards() {
	// Get next document
	db.collection("verbindungen").where("timestamp", "<", categories.timestamp)
	.orderBy("timestamp", "desc")
	.limit(1)
	.get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			if (!doc.exists) return;

			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
		
			// Change number
			urlParams.set('number', doc.id)
		
			const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		
			// Reload the page with the new URL
			window.location.href = newUrl;
		});
	})
	.catch((error) => {
		alert("Error getting puzzle");
	});
}

function forwards() {
	// Get next document
	db.collection("verbindungen").where("timestamp", ">", categories.timestamp)
	.orderBy("timestamp")
	.limit(1)
	.get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			if (!doc.exists) return;
			
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
		
			// Change number
			urlParams.set('number', doc.id)
		
			const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		
			// Reload the page with the new URL
			window.location.href = newUrl;
		});
	})
	.catch((error) => {
		alert("Error getting puzzle");
	});
}