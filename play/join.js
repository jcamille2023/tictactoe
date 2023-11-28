
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, set, ref, onValue, get,child,remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

var playerId = "";
var player_1 = "";
var player_2 = "";
var turn = "";
var opponentId = "";
var positions = {};
var gameId = 0;
var game_data = {};
var game_start = false;
var win_combos =  [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
var positions_used = [];


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

function delete_session() {
	let game_ref = ref(database, "/games/" + gameId);
	remove(game_ref);
	console.log("Game session deleted.");
}
window.delete_session = delete_session;

function declare_win() {
	console.log("win declared");
	get(child(dbRef, "games/" + gameId)).then((snapshot) => {
		const data = snapshot.val();
		var winner = {
			winner: playerId,
		};
		data.win = winner;
		set(ref(database, "games/" + gameId), data);
		
	});
}


function check_win() {
	positions_used = [];
	for(let n = 0; n < Object.keys(positions).length; n++) {
		let b = Object.keys(positions);
		if(positions[b[n]] == playerId) {
			positions_used.push(Number(b[n]));
		}
		
	}
	console.log(positions_used);
    let counter = 0;
    for(let n = 0; n < win_combos.length; n++) {
        for(let t = 0; t < win_combos[n].length; t++) {
            if(positions_used.includes(win_combos[n][t])) {
                counter += 1;
                console.log("New counter: " + counter);
                console.log(win_combos[n][t] + " is in positions_used");
            }
            else {
                console.log(win_combos[n][t] + " is not in positions_used");
                counter = 0;
                break;
            }
        }
        if(counter >= 3) {
            return true;
        }
        else {
            continue;
        }
    }
    return false;
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
    document.getElementById("game_id").innerHTML = gameId;
	get(child(dbRef,'/games/' + gameId)).then((snapshot) => {
		const data = snapshot.val();
		console.log(data);
		// debugging purposes
		console.log("Player 1:");
		console.log(data.player_1);
  		player_2 = playerId;
  
		// adding player_2
		data.player_2 = playerId;
    		player_1 = data.player_1;
    		turn = player_1;
		data.turn = turn;
		opponentId = player_1;
		console.log(data);
		add_player_2(data,gameId);
		game_start = true;

    console.log("User turn:");
		console.log(data.turn);
    
		document.getElementById("user_turn").innerHTML += "(" + opponentId + ")";
		document.getElementById("opponent_id").innerHTML += opponentId;
	});

	const gamesRef = ref(database, 'games/' + gameId);
onValue(gamesRef, (snapshot) => {
	var data = snapshot.val();
	console.log(data);
	 if (data == null && game_start == true) {
		window.location.href = "https://jcamille2023.github.io/tictactoe/multiplayer?game_removed=true";
	}
	if (data == null) {
		console.log("no player turn data to be recorded");
	}
	else {
		var player_turn = data.turn;
		console.log(player_turn);
		if (player_turn == playerId) {
			activate_buttons();
			document.getElementById("user_turn").innerHTML = "O's turn (" + playerId + ")";
		}
		 
		else if (player_turn == opponentId) {
			deactivate_buttons();
			document.getElementById("user_turn").innerHTML = "X's turn (" + opponentId + ")";
		}
	}
	
});

const positionsRef = ref(database, 'games/' + gameId + '/positions');
onValue(positionsRef, (snapshot) => {
	var data = snapshot.val();
	console.log(data);
	if(data == null) {
		console.log("no position data");
	}
	else if(check_win() == false) {
		for(let n = 1; n < 10; n++) {
    			let button_id = "button_" + n.toString();
			console.log(button_id + " changed");
    			if (data[n] == player_1) {
      				document.getElementById(button_id).innerHTML = "X";
    			}
    			else if (data[n] == player_2) {
      				document.getElementById(button_id).innerHTML = "O";
    			}
  		}
	}
	else {
 		declare_win();
		for(let n = 1; n < 10; n++) {
    			let button_id = "button_" + n.toString();
			console.log(button_id + " changed");
    			if (data[n] == player_1) {
      				document.getElementById(button_id).innerHTML = "X";
    			}
    			else if (data[n] == player_2) {
      				document.getElementById(button_id).innerHTML = "O";
    			}
  		}
		
   	}
	
});

const winRef = ref(database, 'games/' + gameId + '/win');
onValue(winRef, (snapshot) => {
	const data = snapshot.val();
	if(data != null) {
	console.log(data);
	deactivate_buttons();
	document.getElementById("user_turn").remove();
	if(data.winner == playerId) {
		document.getElementById("game-winner").innerHTML = "O wins (" + playerId + ")";
	}
	else {
		document.getElementById("game-winner").innerHTML = "X wins (" + opponentId + ")";
	}
	}
	
});

}
else {
	console.log("User is signed out");
}
});

		



function move_multi_2(user_id,button_number) {
	get(child(dbRef, '/games/' + gameId + "/positions")).then((snapshot) => {
			positions = snapshot.val();
			console.log(positions);
			positions[button_number] = user_id;
			console.log(positions);  
			set(ref(database,"/games/" + gameId + "/positions"), positions);
			
		});
}
function move_multi(button_number) {
	console.log(opponentId);
	// button_id = "button" + button_number;
		// document.getElementById(button_id).innerHTML = "X"; when change is detected database will change the button, not the computer
		get(child(dbRef, '/games/' + gameId)).then((snapshot) => {
			var data = snapshot.val();
			game_data = data;
			console.log(game_data);
			console.log(opponentId);
			game_data.turn = opponentId;
			console.log(game_data);
			set(ref(database,"/games/" + gameId), game_data);
		});
			move_multi_2(player_2,button_number); // code sections farther down have been running out of order, therefore, calling them in a separate function will prevent this.
	}
window.move_multi = move_multi;



