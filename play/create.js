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
    appId: "1:971654471519:web:3e05a829c5db81a4f920ea",
    measurementId: "G-1K25R04PQ2"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();
const dbRef = ref(getDatabase());

function random_number_gen() {
	return Math.floor(Math.random() * 9999);
}

function declare_win() {
	console.log("win declared");
	let data = {winner: playerId};
	set(ref(database, "games/" + gameId + "/win"), data);
}

function declare_tie() {
	console.log("tie declared");
	let data = {winner: "tie",};
	set(ref(database, "games/" + gameId + "/win"), data);
}


var playerId;
var opponentId;
var win_combos =  [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
var positions_used = [];
var positions;
var gameId = random_number_gen();
var game_start = false;

function delete_session() {
	let game_ref = ref(database, "/games/" + gameId);
	remove(game_ref);
	console.log("Game session deleted.");
}
window.delete_session = delete_session;

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
    if(positions.length > 9) {
	    return "tie";
    }
    return false;
}



function get_game_data() {
	get(child(dbRef, '/games/' + gameId)).then((snapshot) => {
		return snapshot.val();
	});
}
window.get_game_data = get_game_data;
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
	document.getElementById("user_turn").innerHTML += "(" + playerId + ")";
}


onAuthStateChanged(auth, (user) => {
	if(user) {
		playerId = user.uid;
		console.log("User is signed in");
		console.log(playerId);
		document.getElementById("user_id").innerHTML += playerId;
		document.getElementById("game_id").innerHTML = gameId;
		const gamesRef = ref(database, 'games/' + gameId);
		onValue(gamesRef, (snapshot) => {
			var data = snapshot.val();
			console.log(data);
	 		if (data == null && game_start == true) {
				console.log("game null");
				window.location.href = "https://jcamille2023.github.io/tictactoe/multiplayer?game_removed=true";
			}
		});
		set(ref(database, "/games/" + gameId + "/players"), {
		player_1: playerId,
    		});
		var playersRef = ref(database, "/games/" + gameId + "/players");
		onValue(playersRef, (snapshot) => {
			 const data = snapshot.val();
			 console.log(data);
			 if (data.player_2) {
				 opponentId = data.player_2;
				 document.getElementById("opponent_id").innerHTML += opponentId;
				 set_turn();
				 game_start = true;
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
					document.getElementById("game_winner").innerHTML = "X wins (" + playerId + ")";
				}
				else if(data.winner == "tie"){
					document.getElementById("game_winner").innerHTML = "Tie! No winner.";
				}
				else {
					document.getElementById("game_winner").innerHTML = "O wins (" + opponentId + ")";
				}
			}
		});

		
		var turnRef = ref(database, "/games/" + gameId + "/turn");
		onValue(turnRef, (snapshot) => {
      		const data = snapshot.val();
			if (data != null) {
			const data = snapshot.val();
			if (data.turn == playerId) {
				activate_buttons();
				document.getElementById("user_turn").innerHTML = "X's turn" + "(" + playerId + ")";
			}
			else if (data.turn == opponentId) {
				deactivate_buttons();
				document.getElementById("user_turn").innerHTML = "O's turn" + "(" + playerId + ")";
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
    				if (data[n] == playerId) {
      					document.getElementById(button_id).innerHTML = "X";
    				}
    				else if (data[n] == opponentId) {
      					document.getElementById(button_id).innerHTML = "O";
    				}
  			}
		}
		else if (check_win() == "tie") {
			declare_tie()
			for(let n = 1; n < 10; n++) {
    				let button_id = "button_" + n.toString();
				console.log(button_id + " changed");
    				if (data[n] == playerId) {
      				document.getElementById(button_id).innerHTML = "X";
    				}
    				else if (data[n] == opponentId) {
      					document.getElementById(button_id).innerHTML = "O";
    				}
  			}
		}
		else {
 			declare_win();
			for(let n = 1; n < 10; n++) {
    				let button_id = "button_" + n.toString();
				console.log(button_id + " changed");
    				if (data[n] == playerId) {
      				document.getElementById(button_id).innerHTML = "X";
    				}
    				else if (data[n] == opponentId) {
      					document.getElementById(button_id).innerHTML = "O";
    				}
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
		 // button_id = "button" + button_number;
		// document.getElementById(button_id).innerHTML = "X"; when change is detected database will change the button, not the computer
		get(child(dbRef, '/games/' + gameId + '/turn')).then((snapshot) => {
			var data = snapshot.val();
			data.turn = opponentId;
			set(ref(database,"/games/" + gameId + '/turn'), data);
		});
			move_multi_2(playerId,button_number); // code sections farther down have been running out of order, therefore, calling them in a separate function will prevent this.

}
window.move_multi = move_multi;



