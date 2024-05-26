let hosted = false;

if (hosted) {
	// Initialize Firestore through Firebase
	const app = firebase.initializeApp(keys);
	var analytics = firebase.analytics(app);
	analytics.setUserId(crypto.randomUUID());
	
	var db = firebase.firestore();
}
