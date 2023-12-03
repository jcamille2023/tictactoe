import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, set, ref, onValue, get,child,remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDkf2Xme8vIYwSjNgpikMPlHETkteqEsfI",
    authDomain: "tic-tac-toe-online-108ca.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-online-108ca-default-rtdb.firebaseio.com",
    projectId: "tic-tac-toe-online-108ca",
    storageBucket: "tic-tac-toe-online-108ca.appspot.com",
    messagingSenderId: "971654471519",
    appId: "1:971654471519:web:3e05a829c5db81a4f920ea"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();
const dbRef = ref(getDatabase());

function random_number_gen() {
	return Math.floor(Math.random() * 9999);
}


var playerId;
var opponentId;
var turn;
var win_combos =  [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
var positions_used = [];
var gameId = random_number_gen();

function activate_buttons() { // activates buttons upon player_2 joining
	for (let n = 1; n != 10; n++) { 
        	let b = n.toString();
        	var button_id = "button_" + b;     
        	var button_function = "move_multi(" + b + ")"; 
        	document.getElementById(button_id).setAttribute("onclick",button_function); 
	}
}

function deactivate_buttons() {
	for (let n = 1; n != 10; n++) { 
        	let b = n.toString();
        	var button_id = "button_" + b;      
        	document.getElementById(button_id).setAttribute("onclick",""); 
	}
}

function set_turn() {
	set(ref(database, "/games/" + gameId + "/turn"), {
		turn: playerId,
	});
}


onAuthStateChanged(auth, (user) => {
	if(user) {
		playerId = user.uid;
		console.log("User is signed in");
		console.log(playerId);
		document.getElementById("user_id").innerHTML += playerId;
		set(ref(database, "/games/" + gameId + "/players"), {
		player_1: playerId,
    		});
		var playersRef = ref(database, "/games/" + gameId + "/players");
		onValue(playersRef, (snapshot) => {
			 const data = snapshot.val();
			 if (data.player_2) {
				 opponentId = data.player_2;
				 set_turn();
			 }
		 });
		var turnRef = ref(database, "/games/" + gameId + "/turn");
		onValue(turnRef, (snapshot) => {
      const data = snapshot.val();
			if (data != null) {
			const data = snapshot.val();
			if (data.turn == playerId) {
				activate_buttons();
			}
			else if (data.turn == opponentId) {
				deactivate_buttons();
			}
			}
		});
	}
	else {
		console.log("User is signed out");
	}
});

