// AI computer moves are based on algotytm from http://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
//
var types = ["X", "O"];
var userMark = types[0];
var computerMark = types[1];
//var userTurns = [];
//var computerTurns = [];
var cmpTurn = 1;
var usrTurn = -1;
var allTurns = []; // user -1; Computer = 1;
var turnCnt = 0;
var userScore = 0;
var computerScore = 0;
var ggMsg = ["You won!","Good Game! Friendship wins!", "Computer won! Good luck next time!"];
//var userTurn = 0;

/*TO-DO:
* detect a win
* keep score
* reset score
* mindful opponent
*/
window.onload = function onLoad(){
  //resetGame();
}

document.getElementById("playDiv").style.display = "none";
document.getElementById("scoreDiv").style.display = "none";
document.getElementById("gameResult").style.display = "none";
document.getElementById("choice0").innerHTML = types[0];
document.getElementById("choice1").innerHTML = types[1];
document.getElementById("userScore").innerHTML = userScore;
document.getElementById("computerScore").innerHTML = computerScore;
document.getElementById("resetScoreDiv").addEventListener("click", function(){
  resetAll();
});

var chooseXO = document.getElementsByClassName("chooseXO");
for (var i = 0; i < (chooseXO.length); ++i){
  chooseXO[i].addEventListener("click", function clickXO(){
    console.log("I have chosen", this.innerHTML);
    if (this.innerHTML == types[0]){
      userMark = types[0];
      computerMark = types[1];
    }
    else {
      userMark = types[1];
      computerMark = types[0];
    }
    document.getElementById("chooseDiv").style.display = "none";
    document.getElementById("scoreDiv").style.display = "";
    document.getElementById("playDiv").style.display = "";
  });
}
var fields = document.getElementsByClassName("field");
for(var i = 0; i < fields.length; ++i){
  fields[i].addEventListener("click", function clkField(){
    userTurnFcn(this);
  });
}
function computerTurnFcn(){
  if (turnCnt < 9){
    var turn = findBestMove();
    //computerTurns[turn] = true;
    allTurns[turn] = cmpTurn;
    document.getElementById("field"+turn).children[0].innerHTML = computerMark;
    ++turnCnt;
    if (gameOver()) {
      console.log("Computer Wins");
      computerScore++;
      document.getElementById("computerScore").innerHTML = computerScore;
      document.getElementById("ggMsg").innerHTML = ggMsg[2];
      resetGame();
      showResult();
    }
    //userTurn ^= 1;
  }
  else {
    document.getElementById("ggMsg").innerHTML = ggMsg[1];
    resetGame();
    showResult();
  }
}
function userTurnFcn(elem){
  console.log("Elem: ", elem);
  var numb = elem.id.split("field")[1];
  if (validTurn(numb) && (turnCnt < 9)){
    //userTurns[numb] = true;
    allTurns[numb] = usrTurn;
    document.getElementById(elem.id).children[0].innerHTML = userMark;
    ++turnCnt;
    //userTurn ^= 1;
    if (gameOver()) {
      console.log("User Wins");
      userScore++;
      document.getElementById("userScore").innerHTML = userScore;
      document.getElementById("ggMsg").innerHTML = ggMsg[0];
      resetGame();
      showResult();
      return;
    }
    computerTurnFcn();

  }
}
function isMovesLeft(){
  if (turnCnt < 9) {
    return false;
  }
  return true;
}
var depthBest = [1000, -1000, 1000, -1000, 1000, -1000, 1000, -1000, 1000,  -1000];
function minimax(depth, isMax){
  var score = gameOver();
  var currTurnCnt = turnCnt;
  if (score == 10){ // computer won
    return score - depth; // substract to make the game as short as possible
  }
  if (score == -10){ // user won
    return score + depth;  // add to make game as long as possible
  }
  if (turnCnt >= 9){
    return 0;
  }
  var best;
  var turnMark;
  var turnPlayer;
  var turnFcn;

  if (isMax){ // it is computers turn
    best = -1000;
    turnMark = computerMark;
    turnPlayer = cmpTurn;
    turnFcn = Math.max;
  }
  else { // its users turn
    best = 1000;
    turnMark = userMark;
    turnPlayer = usrTurn;
    turnFcn = Math.min;
  }

    for (var i = 0; i < 9; i++){
      if(!allTurns[i]){ // cell is empty
        if ( ((depth % 2 == 0) && isMax) || ((depth % 2 == 1) && (!isMax)) ){ // every second is computers turn
          console.log('Error: wrong player!');
        }
        allTurns[i] = turnPlayer;
        document.getElementById("field"+i).children[0].innerHTML = turnMark;
        turnCnt++;
        var current = minimax(depth+1, (!isMax));
        best = turnFcn(best, current);
        depthBest[depth] = turnFcn(best,depthBest[depth]);
        allTurns[i] = 0; // undo the move
        document.getElementById("field"+i).children[0].innerHTML = "";
        turnCnt = currTurnCnt;
      }
    }
  return best;
}

function findBestMove(){
  var currTurnCnt = turnCnt;
  var bestVal = -1000;
  var bestMove;
  for (var i = 0; i < 9; i++){
    if (allTurns[i] == undefined || allTurns[i] == 0){
      allTurns[i] = cmpTurn;
      document.getElementById("field"+i).children[0].innerHTML = computerMark;
      document.getElementById("field"+i).children[0].style.color = "red";
      turnCnt++;
      var moveVal = minimax(0, false); // calculate best turn ...
      allTurns[i] = 0;
      document.getElementById("field"+i).children[0].innerHTML = "";
      document.getElementById("field"+i).children[0].style.color = "";

      turnCnt = currTurnCnt;
       if(moveVal > bestVal){
         bestMove = i;
         bestVal = moveVal;
       }
    }
  }
  console.log("best move: " + bestMove + " best value: " + bestVal);
  return bestMove;
}

function generateTurn(){
  return findBestMove();
/*
  var turn = Math.floor(Math.random()*9); // 0..8
  for (var i = 0; i < 9; i++){
    if (validTurn(turn)){
      return turn;
    }
    else{
      turn = (++turn) % 9;
    }
  }
  return turn;
*/
}
function validTurn(turn){
  if ( allTurns[turn] == undefined || allTurns[turn] == 0){
    return true;
  }
  return false;
  /*
  if ( (userTurns[turn] == undefined) && (computerTurns[turn] == undefined) ) {
    return true;
  }
  else {
    return false;
  }
  */
}
function showResult(){
  div = document.getElementById("gameResult");
  div.style.display = "";
  hideDiv(div);
}
function resetGame(){
  console.log("Resetting the game!");
  //userTurns = [];
  //computerTurns = [];
  allTurns = [];
  turnCnt = 0;
  var fields = document.getElementsByClassName("fieldSpan");
  for(var i = 0; i < fields.length; ++i){
    fields[i].innerHTML = "";
  }

}
function hideDiv(div){
  setTimeout(function (){div.style.display = "none";}, 1000);
}

function gameOver(){
  var over = false;
  for (var i = 0; i < 3; ++i){
    over = checkRow(i);
    if(over){ return over;}
    over = checkColumn(i);
    if(over){ return over;}
  }
  over = checkDiag();
  if(over){ return over;}
  return 0;
}
function checkColumn(i){
  var sum = allTurns[i] + allTurns[3+i] + allTurns[2*3+i];
  if (sum == 3 || sum == -3){
    return ((sum * 3) + (sum % 2)); // +10 or -10
  }
  return 0;
}
function checkRow(i){
  var sum = allTurns[3*i] + allTurns[3*i+1] + allTurns[3*i+2];
  if (sum == 3 || sum == -3){
    return ((sum * 3) + (sum % 2)); // +10 or -10
  }
  return 0;
}
function checkDiag() {
  var sum = allTurns[0] + allTurns[4] + allTurns[8];
  if (sum == 3 || sum == -3){
    return ((sum * 3) + (sum % 2)); // +10 or -10
  }
  sum = allTurns[2] + allTurns[4] + allTurns[6];
  if (sum == 3 || sum == -3){
    return ((sum * 3) + (sum % 2)); // +10 or -10((sum * 3) + 1);
  }
  return 0;
}
function resetAll(){
  computerScore = 0;
  document.getElementById("computerScore").innerHTML = computerScore;
  userScore = 0;
  document.getElementById("userScore").innerHTML = userScore;
  resetGame();
}
