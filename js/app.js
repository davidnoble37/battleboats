console.log("running")

var $gameGrid = $(".gridSquare")
var $sfComm = $(".sfComm")
var $lfComm = $(".lfText")
var $button = $(".lfButton")
var playerOneName
var playerTwoName
var boats
var boards
var hitCount
var boatLength
var boatCount
var currentBoat
var currentPlayer
var otherPlayer


startingState()

function startingState(){
  boats = {
    player1: [ [],[],[] ],
    player2: [ [],[],[] ]
  }

  boards = {
    player1: [ [],[],[],[],[],[],[],[] ],
    player2: [ [],[],[],[],[],[],[],[] ]
  }

  for(var y = 0; y < 8; y++){
    for(var x = 0; x < 8; x++){
      boards["player1"][y][x] = 'w';
      boards["player2"][y][x] = 'w';
    }
  }

  hitCount = {
    player1: 0,
    player2: 0,
  }

  boatLength = 2
  boatCount = 3
  currentBoat = 0
  currentPlayer = "player1"
  otherPlayer = "player2"
  $("#player1Turn").text("X")
  $("#player2Turn").text("")

  // Welcome message, display instructions, and button says 'start'
  $sfComm.text("Welcome to BattleBoats! Read instructions and press 'Start' to begin")
  $lfComm.text("Rules of BattleBoats:\n- Each player secretly places 3 boats on their game board\n- Players then alternate guessing the coordinates of the other player's boats\n- First player to sink all of their opponent's boats wins\n- Hope you can swim..")

  $button.text("Start!")
  $button.on('click', p1Pass)
}


function switchCurrentPlayer(){
  if(currentPlayer === "player1"){
    currentPlayer = "player2"
    otherPlayer = "player1"
    $("#player1Turn").text("")
    $("#player2Turn").text("X")
  }else if(currentPlayer === "player2"){
    currentPlayer = "player1"
    otherPlayer = "player2"
    $("#player1Turn").text("X")
    $("#player2Turn").text("")
  }
console.log("post switch current player" + currentPlayer)
}

// Pass to Player 1
function p1Pass(){
  $sfComm.text("Pass laptop to Player 1")
  $lfComm.text("It's Player 1's turn to place boats.\n\nPass laptop to Player 1 and shield screen to keep boat locations private.\n\nHit the button below when ready.")

  $button.text("Ready to Place Player 1's Boats")
  $button.off('click', p1Pass)
  $button.on('click', placeBoats)

  console.log("post p1Pass " + currentPlayer)
}

// Player One Places Boats
function placeBoats (){
  // Button updates and instructions
  $button.off('click', placeBoats)
  $button.text(currentPlayer + ", go ahead and place your boats")

  $sfComm.text(currentPlayer + ": Place your boats")
  $lfComm.text("Please place each boat in adjacent vertical or horizontal cells (not diagonal). \n\nFirst Boat: 2 squares long\nSecond boat: 3 squares long\nThird boat: 4 squares long")

  // Place click sensors on cells
  for(var i = 0; i < $gameGrid.length; i++){
    $gameGrid.eq(i).on('click', boatClickHandler)
  }

  console.log("post placeBoats " + currentPlayer)
}

// Boat Click Handler - Place boats and check for completeness
function boatClickHandler() {
  console.log("pre boatClickHandler " + currentPlayer)
  console.log("pre boatClickHandler " + " boatLength: " + boatLength + " boatCount: " + boatCount)

  // Tag selected boat on board
  $(this).text("Boat " + currentBoat);
  $(this).css('background-color', 'grey');
  $(this).off('click', boatClickHandler);

  var newCoord = []
  newCoord.push($(this).data("row"));
  newCoord.push($(this).data("column")); //need to make this dynamic "current player boats"
  boats[currentPlayer][currentBoat].push(newCoord);

  checkCompleteBoat()
  checkCompleteTurn()

  console.log("post boatClickHandler " + " boatLength: " + boatLength + " boatCount: " + boatCount)
}

// Check if complete boat has been applied
function checkCompleteBoat(){

console.log("pre checkCompleteBoat " + " boatLength: " + boatLength + " boatCount: " + boatCount)

  // Advance to next boat when prior boat is completed and prompt submit when done with last boat
  if(boats[currentPlayer][currentBoat].length === boatLength){
    boatLength += 1
    currentBoat += 1
  }
console.log("post checkCompleteBoat " + " boatLength: " + boatLength + " boatCount: " + boatCount)

console.log("post checkCompleteBoat " + currentPlayer)
}

// Check if all boats have been placed - if P2, start game
function checkCompleteTurn(){
  if(currentBoat === boatCount){
    // Lock board
    for(var i = 0; i < $gameGrid.length; i++){
      $gameGrid.eq(i).off('click', boatClickHandler)
    }
    $button.text("Submit Boat Locations")

    // Either pass to player 2 or start game
    if(currentPlayer === "player1"){
      $button.on('click', p2Pass)
    }else{
      $button.on('click', transitionToGame)

    }
  }
  console.log("post checkCompleteTurn " + currentPlayer)
}

// Pass to player 2 and loop back to place boats
function p2Pass(){

  for(var i = 0; i < $gameGrid.length; i++){
    $gameGrid.eq(i).off('click', boatClickHandler).text("").css('background-color', 'dodgerblue');
  }

  $sfComm.text("Pass laptop to Player 2")
  $lfComm.text("It's Player 1's turn to place boats.\n\nPass laptop to Player 1 and shield screen to keep boat locations private.\n\nHit the button below when ready.")

  $button.text("Ready to Place Player 2's Boats!")

  $button.off('click', p2Pass)
  $button.on('click', placeBoats)

  switchCurrentPlayer();
  boatLength = 2;
  currentBoat = 0;

  console.log("post p2Pass " + currentPlayer)
}

function transitionToGame(){
  $button.off('click', transitionToGame)
  $button.on('click', startGame)
  $button.text("Ready to Start!")

  $sfComm.text("Time to Play!")
  $lfComm.text("Now that the boats are placed, it's time to start the game.\n\nPlayer 1 goes first.\n\nClick on a space on the grid to guess a boat location.\n\nAfter clicking:\nIf square goes red, you hit a boat.\n\If square goes green, there's nothing there.")

  clearGrid()
}


function startGame(){
  console.log("pre startGame " + currentPlayer)
  $button.off('click', startGame)

  switchCurrentPlayer()
  showBoard()

  $button.text(currentPlayer + "'s Turn")
  $sfComm.text("Choose a square to attack")
  $lfComm.text(currentPlayer + ", click on a square to attack.\n\nPress 'Finish Turn' button when done.")

  console.log("post startGame " + currentPlayer)
}

// Clears game board on screen and reverts back to blue squares
function clearGrid (){
  for(var i = 0; i < $gameGrid.length; i++){
    $gameGrid.eq(i).text("").css('background-color', 'dodgerblue').off('click', shotClickHandler);
  }
console.log("post clearGrid" + currentPlayer)
}

// reflect stored board on grid
function showBoard(){
  for(var y = 0; y < 8; y++){
    for(var x = 0; x < 8; x++){
      if(boards[currentPlayer][y][x] == "w"){
        $gameGrid.eq(y * 8 + x).css('background-color', 'dodgerblue').on('click', shotClickHandler)
        // if square is w then place event listener and make blue
      }else if(boards[currentPlayer][y][x] == "m"){
        $gameGrid.eq(y * 8 + x).css('background-color', 'green')
        // if square is m then place green
      }else if(boards[currentPlayer][y][x] == "h"){
        $gameGrid.eq(y * 8 + x).css('background-color', 'red')
        // if square is h, then place red
      }
    }
  }
console.log("post showboard" + currentPlayer)
}

//
function shotClickHandler(){
  console.log("pre shotClickHandler" + currentPlayer)
  var row = $(this).data("row")
  var column = $(this).data("column")
  var submission = [row, column]
  checkMatch(submission)
  console.log("post shotClickHandler" + currentPlayer)
}

//
function checkMatch(submit){
  var miss = true;

  for(var b = 0; b < 3; b++){
    for(var c = 0; c < 4; c++){

      if(boats[otherPlayer][b][c] && boats[otherPlayer][b][c].join() == submit.join()){

          boards[currentPlayer][submit[1]][submit[0]] = "h"

          $gameGrid.eq(submit[1] * 8 + submit[0]).css('background-color', 'red')
          console.log("hit!" + currentPlayer)
          miss = false
          // increase hit count by 1
          hitCount[currentPlayer] += 1

          // check winner

          if(checkWinner()){
            b = 4;
            c = 5;
          }

      }
    }
  }
  if(miss){
    boards[currentPlayer][submit[1]][submit[0]] = "m";
    $gameGrid.eq(submit[1] * 8 + submit[0]).css('background-color', 'green');
    console.log("miss!" + currentPlayer)
  }
  if(!checkWinner()){
    $button.text("Finish Turn")
    $button.on('click', switchTurns)
    console.log("post checkMatch" + currentPlayer)
  }
}

//
function switchTurns(){
  $button.off('click', switchTurns)
  $button.on('click', finishSwitch)
  console.log("pre switch turns " + currentPlayer)
  // switch current player
  switchCurrentPlayer()
  console.log("post switch turns switch player " + currentPlayer)
  // prompt to pass to other player
  $sfComm.text("Pass laptop to " + currentPlayer)
  $lfComm.text("It's " + currentPlayer + "'s turn.\nWhen ready to play, press 'Ready' button.")
  $button.text("Ready")

  clearGrid()
}

function finishSwitch(){
  $button.off('click', finishSwitch)
  $button.text(currentPlayer + "'s Turn")

  $sfComm.text("Click on a square to attack")
  $lfComm.text(currentPlayer + ", click on a square to attack.\n\nPress Finish Turn when done.")


  // clear game board and place other players board on grid
  //clearGrid()
  showBoard()

  console.log("post switch turns" + currentPlayer)
}

// check to see if hits count = total number of boat squares
function checkWinner(){
  if(hitCount[currentPlayer] == 3){
    // winner notification
    $sfComm.text(currentPlayer + " Wins!!")
    $lfComm.text(currentPlayer + " Wins!!")

    $button.text("Game Over")
    $button.off('click', switchTurns)

    return true

  }
}



// Future Improvements
// - scoreboard animation
// - authenticate placement
// - input names
// - boat sink notifications
// - win and boat sink graphics
// - show game board to loser
