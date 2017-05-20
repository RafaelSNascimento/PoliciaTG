$(function(){
	try{
		var config = {
		    apiKey: "AIzaSyACV5gEDVb-hi9HXRe3qjSHzsIubG_wJls",
		    authDomain: "chatapp-fc9cb.firebaseapp.com",
		    databaseURL: "https://chatapp-fc9cb.firebaseio.com",
		    projectId: "chatapp-fc9cb",
		    storageBucket: "chatapp-fc9cb.appspot.com",
		    messagingSenderId: "487121043257"
		};
		firebase.initializeApp(config);
	}catch(err){
		console.log(err);
	}
})