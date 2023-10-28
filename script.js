const row_1 = [0,1,2];
const row_2 = [0,1,2];
const row_3 = [0,1,2];
var turn_counter = 0;

function play_again() {
  location.reload();
}

function checkWin() {
  if (row_1[0] == "X" && row_1[1] == "X" && row_1[2] == "X") {
    var display_win = document.getElementById("game_winner");
    display_win.innerHTML = "X wins";
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  } 
  
  
  else if (row_2[0] == "X" && row_2[1] == "X" && row_2[2] == "X") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "X wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  } 
  else if (row_3[0] == "X" && row_3[1] == "X" && row_3[2] == "X") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "X wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  } 
  
  
  else if (row_1[0] == "X" && row_2[0] == "X" && row_3[0] == "X") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "X wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  } 
  
  else if (row_1[1] == "X" && row_2[1] == "X" && row_3[1] == "X") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "X wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_1[2] == "X" && row_2[2] == "X" && row_3[2] == "X") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "X wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_1[0] == "X" && row_2[1] == "X" && row_3[2] == "X") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "X wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_3[2] == "X" && row_2[1] == "X" && row_1[0] == "X") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "X wins";
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_1[0] == "O" && row_1[1] == "O" && row_1[2] == "O") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "O wins";
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_2[0] == "O" && row_2[1] == "O" && row_2[2] == "O") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "O wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_3[0] == "O" && row_3[1] == "O" && row_3[2] == "O") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "O wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_1[0] == "O" && row_2[0] == "O" && row_3[0] == "O") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "O wins"; 
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_1[1] == "O" && row_2[1] == "O" && row_3[1] == "O") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "O wins";
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_1[2] == "O" && row_2[2] == "O" && row_3[2] == "O") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "O wins";
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_1[0] == "O" && row_2[1] == "O" && row_3[2] == "O") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "O wins";
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
  else if (row_3[2] == "O" && row_2[1] == "O" && row_1[0] == "O") {
    display_win = document.getElementById("game_winner");
    display_win.innerHTML = "O wins";
    play_again_button = document.getElementById("play_again");
    play_again_button.setAttribute("style","display: visible;");
  }
    
  else {
    
    turn_counter = turn_counter + 1;
    
    if (turn_counter == 9) {
      display_win = document.getElementById("game_winner");
      display_win.innerHTML = "Tie";
      play_again_button = document.getElementById("play_again");
      play_again_button.setAttribute("style","display: visible;");
      
    }
    
    
  }

  
  
  
  
}
function move(a) {
  var message_to_user = document.getElementById("user_turn");
  var user_turn = message_to_user.innerHTML;
  console.log("");
  var turn = user_turn.slice(0,1);
  if (a > 0 && a < 4) {
    row_1[a-1] = turn;
  }
  if (a > 3 && a < 7)  {
    row_2[a-4] = turn;
  }
  if (a > 6 && a < 10)  {
    row_3[a-7] = turn;
  }
  if (turn == "X") {
    user_turn = "O's turn";
    message_to_user.innerHTML =  user_turn; 
  }
  else {
    user_turn = "X's turn";
    message_to_user.innerHTML =  user_turn; 
  }
  button_id = "button_" + a.toString();
  position_selected = document.getElementById(button_id);
  position_selected.innerHTML = turn;
  console.log(row_1);
  console.log(row_2);
  console.log(row_3);
  checkWin();

  
  
  
  
    
  
}
