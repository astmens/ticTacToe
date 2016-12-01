var types = ["X", "O"];
var userMark = types[0];
var computerMark = types[1];
//var userTurns = [];
//var computerTurns = [];
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
    var turn = generateTurn();
    //computerTurns[turn] = true;
    allTurns[turn] = 1;
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
    allTurns[numb] = -1;
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

function generateTurn(){
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
}
function validTurn(turn){
  if ( allTurns[turn] == undefined){
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
    if(over){ return true;}
    over = checkColumn(i);
    if(over){ return true;}
  }
  over = checkDiag();
  if(over){ return true;}
  return false;
}
function checkColumn(i){
  var sum = allTurns[i] + allTurns[3+i] + allTurns[2*3+i];
  if (sum == 3 || sum == -3){
    return true;
  }
  return false;
}
function checkRow(i){
  var sum = allTurns[3*i] + allTurns[3*i+1] + allTurns[3*i+2];
  if (sum == 3 || sum == -3){
    return true;
  }
  return false;
}
function checkDiag() {
  var sum = allTurns[0] + allTurns[4] + allTurns[8];
  if (sum == 3 || sum == -3){
    return true;
  }
  sum = allTurns[2] + allTurns[4] + allTurns[6];
  if (sum == 3 || sum == -3){
    return true;
  }
  return false;
}
function resetAll(){
  computerScore = 0;
  document.getElementById("computerScore").innerHTML = computerScore;
  userScore = 0;
  document.getElementById("userScore").innerHTML = userScore;
  resetGame();
}
