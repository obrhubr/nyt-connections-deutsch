let hosted = false;

if (hosted) {
	// Initialize Firestore through Firebase
	const app = firebase.initializeApp(keys);
	var analytics = firebase.analytics(app);
	var userId = crypto.randomUUID();
	analytics.setUserId(userId);
	
	var db = firebase.firestore();
}
