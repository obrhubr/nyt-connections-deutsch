let hosted = false;

if (hosted) {
	// Initialize Firestore through Firebase
	const app = firebase.initializeApp(keys);
	var analytics = firebase.analytics(app);

	var userId = "";
	if (localStorage.getItem("userId") == null) {
		userId = crypto.randomUUID();
		userId = localStorage.setItem("userId")
	} else {
		userId = localStorage.getItem("userId")
	};
	analytics.setUserId(userId);
	
	var db = firebase.firestore();
}
