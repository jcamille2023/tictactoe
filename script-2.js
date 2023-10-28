import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, set, ref, onValue, get,child,remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

var playerId = "";
var player_1 = "";
var player_2 = "";
var turn = "";
var opponentId = "";
var n = 0;
var positions = {};
var gameId = 0;
var game_data = {};


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

function random_number_gen() { // generates gameId
	return Math.floor(Math.random() * 9999);
}

function add_player_2(a,b) { // adds player 2 to database
	set(ref(database, "/games/" + b), a);
 }

function deactivate_buttons() {
	for (let n = 1; n != 10; n++) { 
        	let b = n.toString();
        	var button_id = "button_" + b;      
        	document.getElementById(button_id).setAttribute("onclick",""); 
	}
}

function activate_buttons() { // activates buttons upon player_2 joining
	for (let n = 1; n != 10; n++) { 
        	let b = n.toString();
        	var button_id = "button_" + b;     
        	var button_function = "move_multi(" + b + ")"; 
        	document.getElementById(button_id).setAttribute("onclick",button_function); 
	}
}


onAuthStateChanged(auth, (user) => {
if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    playerId = user.uid;
    console.log(playerId);
    console.log("User is signed in");
    document.getElementById("user_id").innerHTML += playerId;
    const searchParams = new URLSearchParams(window.location.search);
    gameId = searchParams.get('game_id');
if (gameId == "new") {
	console.log(playerId);
	var game_state = "new";
	gameId = random_number_gen();
    	document.getElementById("game_id").innerHTML = gameId;
	set(ref(database, "/games/" + gameId), {
		player_1: playerId,
	});
	set(ref(database,"/games/" + gameId + "/turn"), {
		turn: playerId
	});
	player_1 = playerId;
	turn = playerId;
	document.getElementById("user_turn").innerHTML += "(" + playerId + ")";
	const gamesRef = ref(database, 'games/' + gameId);
	onValue(gamesRef, (snapshot) => {
		n += 1;
		console.log(n);
		var data = snapshot.val();
		player_2 = data['player_2'];
		console.log(player_2);
		opponentId = player_2;

		if (n == 2) {
			document.getElementById("opponent_id").innerHTML += opponentId;
			activate_buttons();
		}
		else {console.log("opponent exists or too early");}
		
		
	});
    }
else {
    document.getElementById("game_id").innerHTML = gameId;
	get(child(dbRef,'/games/' + gameId)).then((snapshot) => {
		const data = snapshot.val();
		console.log(data);
		// debugging purposes
		console.log("Player 1:");
		console.log(data['player_1']);
		console.log("User turn:");
		console.log(data.turn.turn);
		
		// adding player_2
		data['player_2'] = playerId;
		console.log(data);
		add_player_2(data,gameId);
		
		player_1 = data['player_1'];
		turn = data.turn.turn;
		opponentId = player_1;
		document.getElementById("user_turn").innerHTML += "(" + opponentId + ")";
		document.getElementById("opponent_id").innerHTML += opponentId;
	});
    }

}
else {
	console.log("User is signed out");
}
});
const gamesRef = ref(database, 'games/' + gameId);
onValue(gamesRef, (snapshot) => {
	var data = snapshot.val();
	var player_turn = data['turn'];
	console.log(player_turn);
	if (player_turn == playerId) {
		activate_buttons();
		if (playerId == player_1) {
		document.getElementById("user_turn").innerHTML = "X's turn (" + playerId + ")";
		}
		else if (playerId == player_2) {
		document.getElementById("user_turn").innerHTML = "O's turn (" + playerId + ")";
		}
		
	}
	else if (player_turn == opponentId) {
		deactivate_buttons();
		if (opponentId == player_1) {
		document.getElementById("user_turn").innerHTML = "X's turn (" + opponentId + ")";
		}
		else if (playerId == player_2) {
		document.getElementById("user_turn").innerHTML = "O's turn (" + opponentId + ")";
		}
	}
	
});

const positionsRef = ref(database, 'games/' + gameId + '/turn');
onValue(positionsRef, (snapshot) => {
	var data = snapshot.val();
	positions = data[positions];
	console.log(positions);
	for (let n = 1; n == Object.keys(positions).length; n++) {
		positions_used = Object.keys(positions)
		let b = n.toString();
		if (b in positions_used) {
        		var button_id = "button_" + b;     
        		if (playerId == player_1) {
        			document.getElementById(button_id).innerHTML("X");
			}
			else {
				document.getElementById(button_id).innerHTML("O");
			}
		}
	}
	
});
		



function move_multi_2(user_id,button_number) {
	get(child(dbRef, '/games/' + gameId + "/positions")).then((snapshot) => {
			positions = snapshot.val();
			console.log(positions);
			if (positions != null) {
				positions[button_number] = user_id;
				console.log(positions);
				set(ref(database,"/games/" + gameId + "/positions"), positions);
			}
			else {
				positions = {};
				positions[button_number] = user_id;
				console.log(positions);
				set(ref(database,"/games/" + gameId + "/positions"), positions);
			}
			
		});
}
function move_multi(button_number) {
	console.log(player_2);
	if (playerId == player_1) {
		 // button_id = "button" + button_number;
		// document.getElementById(button_id).innerHTML = "X"; when change is detected database will change the button, not the computer
		get(child(dbRef, '/games/' + gameId)).then((snapshot) => {
			var data = snapshot.val();
			game_data = data;
			console.log(game_data);
			console.log(player_2);
			game_data.turn = player_2;
			console.log(game_data);
			set(ref(database,"/games/" + gameId), game_data);
		});
			move_multi_2(player_1,button_number); // code sections farther down have been running out of order, therefore, calling them in a separate function will prevent this.
	}
	else {
		 // button_id = "button" + button_number;
		// document.getElementById(button_id).innerHTML = "X"; when change is detected database will change the button, not the computer
		get(child(dbRef, '/games/' + gameId)).then((snapshot) => {
			var data = snapshot.val();
			game_data = data;
			console.log(game_data);
			console.log(player_1);
			game_data.turn = player_1;
			console.log(game_data);
			set(ref(database,"/games/" + gameId), game_data);
			move_multi_2(player_2,button_number); // code sections farther down have been running out of order, therefore, calling them in a separate function will prevent this.
			
			
		});
	}
}
window.move_multi = move_multi;




 



	

