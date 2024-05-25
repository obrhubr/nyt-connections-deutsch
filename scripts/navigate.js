function backwards() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	// Change number
	urlParams.set('number', Number(urlParams.get('number')) > 0 ? Number(urlParams.get('number')) - 1 : 0)

	const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

	// Reload the page with the new URL
	window.location.href = newUrl;
}

function forwards() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	// Change number
	urlParams.set('number', Number(urlParams.get('number')) + 1)

	const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

	// Reload the page with the new URL
	window.location.href = newUrl;
}