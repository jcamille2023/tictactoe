    var playerId = "";
    var player_1 = "";
    var player_2 = "";
    var opponentId = "";
    var player_turn = "";
    var x_or_o = "";
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
    import { getAuth, onAuthStateChanged, signInAnonymously, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
    import { getDatabase, set, ref, onValue, get,child,remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";


      
      function change_values(a,c,d) { // a is the list of positions, c is the user's computer, d is the opponent's computer
        console.log(document.getElementById("user_turn").innerHTML);
        player_turn = document.getElementById("user_turn").innerHTML;
        var player_turn_2 = document.getElementById("user_turn").innerHTML;
        x_or_o = Array.from(player_turn)[0];

        
        for (let n = 0; n != 9; n++) {
          var b = n.toString();
          var button_id = "button_" + b;
          console.log(player_1); 
          if (n in a) {
            if (a[n] == player_1) {
                document.getElementById(button_id).innerHTML = "X";
                document.getElementById(button_id).setAttribute("onclick","");
            }
            else {
                document.getElementById(button_id).innerHTML = "O";
                document.getElementById(button_id).setAttribute("onclick","");  
            }
              
            
          }
        }
        console.log(player_turn_2.slice(14,42));
        console.log(c);
        console.log(x_or_o);
        if (x_or_o == "X") {
          if (player_turn_2.slice(14,42) == c) {
            document.getElementById("user_turn").innerHTML = "O's turn (" + d + ")";
            for (let n = 0; n != 9; n++) {
              var b = n.toString();
              var button_id = "button_" + b; 
                document.getElementById(button_id).setAttribute("onclick","");
          }
        }
            
          else {
            document.getElementById("user_turn").innerHTML = "O's turn (" + c + ")";
            for (let n = 0; n != 9; n++) {
              var b = n.toString();
              var button_id = "button_" + b;
              if (document.getElementById(button_id).innerHTML == x_or_o) {
              document.getElementById(button_id).setAttribute("onclick","");
              }
              else {
                var t = n + 1
                var button_function = "move_multi(" + t + ")"
                document.getElementById(button_id).setAttribute("onclick",button_function);
              }
          }
          }
          
        }
        else {
          if (player_turn_2.slice(14,42) == c) {
            document.getElementById("user_turn").innerHTML = "X's turn (" + d + ")";
          }
          else {
            document.getElementById("user_turn").innerHTML = "X's turn (" + c + ")";
            for (let n = 0; n != 9; n++) {
              var b = n.toString();
              var button_id = "button_" + b;
              if (document.getElementById(button_id).innerHTML == x_or_o) {
              document.getElementById(button_id).setAttribute("onclick","");
              }
              else {
                var t = n + 1
                var button_function = "move_multi(" + t + ")"
                document.getElementById(button_id).setAttribute("onclick",button_function);
              }
          }
        }
      }
      }
      var game_state = "";
      var positions_filled = {};

      const searchParams = new URLSearchParams(window.location.search);
      var gameId = searchParams.get('game_id');
      if (gameId == "new") {
        game_state = "new";
        gameId = random_number_gen();
        document.getElementById("game_id").innerHTML = gameId;
      }
      else {
        document.getElementById("game_id").innerHTML = gameId;
      }
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDkf2Xme8vIYwSjNgpikMPlHETkteqEsfI",
    authDomain: "tic-tac-toe-online-108ca.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-online-108ca-default-rtdb.firebaseio.com",
    projectId: "tic-tac-toe-online-108ca",
    storageBucket: "tic-tac-toe-online-108ca.appspot.com",
    messagingSenderId: "971654471519",
    appId: "1:971654471519:web:3e05a829c5db81a4f920ea"
  };

  // Initialize Firebase
  var player_1_exist = "";
var p = 0; // counter to determine if the opponent has already been displayed
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase();
  const dbRef = ref(getDatabase());
  function display_opponent(a,b,c) { // a is opponent ID, b is player_1 (user turn purposes), c is the user's computer
    if (p < 2) {
    p += 1;
    document.getElementById("opponent_id").innerHTML = a;
    document.getElementById("user_turn").innerHTML += " (" + b + ")";
    if (b == c) { // if the user is player_1
      for (let n = 1; n != 10; n++) { 
        let b = n.toString();
        var button_id = "button_" + b;     
        var button_function = "move_multi(" + b + ")"; 
        document.getElementById(button_id).setAttribute("onclick",button_function); 
      }
    }
    }
    else {
        console.log("opponent already registered");
    }
    
  }
  function add_players(a,b) {
    console.log(a);
    console.log(b);
    set(ref(database, '/games/' + gameId), {
    player_1: a,
    player_2: b,
    turn: a,
    });
  }

  onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    playerId = user.uid;
    console.log(playerId);
    console.log("User is signed in");
      // const gamesRef = ref(database, 'games/');
    // get(child(dbRef, "games/" + gameId)).then((snapshot) => {

    // });

    if (game_state == "new") {
    player_1 = playerId;
    set(ref(database, '/games/' + gameId), {
    player_1: playerId,
    });
    const gamesRef = ref(database, 'games/' + gameId);
    onValue(gamesRef, (snapshot) => {
      var data = snapshot.val();
      opponentId = data['player_2'];
      display_opponent(opponentId,playerId,playerId);
      });

    const turnRef = ref(database, 'games/' + gameId);
    onValue(turnRef, (snapshot) => {
        var data = snapshot.val();
        
  });
    }
    else {
    player_2 = playerId;
    get(child(dbRef, '/games/' + gameId)).then((snapshot) => {
      var existing_data = snapshot.val();
      console.log(existing_data);
      player_1_exist = existing_data['player_1'];
      add_players(player_1_exist,playerId);
      display_opponent(player_1_exist,player_1_exist,playerId);
    });  
    

        
  }
    
    console.log(playerId);
    document.getElementById("user_id").innerHTML = playerId;
    const positionsRef = ref(database, 'games/' + gameId + '/positions');
    onValue(positionsRef, (snapshot) => {
      var data = snapshot.val();
      var positions = data['positions'];
      change_values(positions,playerId,opponentId);
    });
    
    // ...
  } else {
    console.log("User is signed out");
    // User is signed out
    // ...
  }
});


setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInAnonymously(auth);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

  function change_turn(a,b) {
    console.log(player_turn.slice(14,42));
    if (player_turn.slice(14,42) == a) {
      var c = b;
    }
    else {
      var c = a;
    }

    
    
    set(ref(database, '/games/' + gameId), {
    player_1: a,
    player_2: b,
    turn: c,
    });
  }
  function move_multi(a) {
    positions_filled[a] = playerId;
    console.log(positions_filled);
    
    get(child(dbRef, '/games/' + gameId + "/positions")).then((snapshot) => {
      var existing_data = snapshot.val();
      console.log(existing_data);
      positions_filled = existing_data['positions'];
    });
      
    set(ref(database, '/games/' + gameId + "/positions"), {
    positions: positions_filled, 
    });

    change_turn(player_1_exist, player_2);
    
  }

    function delete_session() {
        var gameRef = ref(database, 'games/' + gameId);
        remove(gameRef);
        
      }
      window.delete_session = delete_session;  
      window.move_multi = move_multi;
