//Load Boards from file or manually
//It is a random variable i have taken 
const Easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const Medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const Hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

//Create variables
var timer;
var timeRemaining;
var lives;
var selectNum;
var selectTile; 
var disableSelect;
  
window.onload = function() {
    //Run startgame function when button is clicked
     id("start btn").addEventListener("click", startGame); 
     //to add event to each number in number container
     for (let i = 0; i < id("number-container").children.length; i++) {
         id("number-container").children[i].addEventListener("click", function() {
             //if selecting i = not disabled
             if (!disableSelect) {
                 //if number is already selected
                 if(this.classList.contains("selected")) {
                 //then remove selection
                     this.classList.remove("selected");
                     selectedNum = null;
                     }else {
                         //deselect all the other numbers
                         for (let i = 0; i < 9; i++) {
                         id("number-container").children[i].classList.remove("selected");
                         } 
                         //select it nd update selected variable
                         this.classList.add("selected");
                         selectedNum =this;
                         updateMove();
                     }
             }
         });
     } 
}

function startGame(){
    //choose board difficulty
    let board;
    if (id("diff-1").checked) board = Easy[0];
    else if (id("diff-2").checked) board = Medium[0];
    else board = Hard[0];
    //set lves to 3 and enable selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "lives Remaining: 3";
    //creates board based on difficulty
    generateBoard(board);
    //start the timer
    startTimer();
    //sets theme based input
    if (id("theme-1").checked) {
       qs("body").classList.remove("dark");
     } else {
       qs("body").classList.add("dark");
    }
    //show number-container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    //sets time remaining based on input
    if (id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    //sets timer for first second
    id("timer").textContent = timeConversion(timeRemaining);
    //sets timer to update every second
    timer = setInterval(function() {
        timeRemaining --;
        //if no time remaining end the game
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
     }, 1000)
}
//converts seconds into string of MM:SS format
function timeConversion(time) {
    let minutes = Math.floor(time /60);
    if (minutes <10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    //clear previous board
    clearPrevious();
    //let used to increment tile ids
    let idCount = 0;
    //create 81 tiles
    for (let i = 0; i < 81; i++) {
        //create a new paragraph element
        let tile = document.createElement("p");
        //if the tile is not supposed to be blank
        if (board.charAt(i) !="-") {
          //set tile text to correct number
          tile.textContent = board.charAt(i);
        } else {
            //add click event listener to tile
            tile.addEventListener("click", function() {
                //if selecting is not disabled
                if (!disableSelect) {
                    //if the tile is already selected
                    if(tile.classList.contains("celected")) {
                        //then remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    }else {
                        //deselect all other tiles
                        for (let i = 0; i < 81; i++) { 
                        qsa(".tile")[i].classList.remove("selected");
                        }
                        //add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        //assign  tile id
        tile.id = idCount;
        //increment for  next tile
        idCount ++;
        // add tile class to all tiles
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)) {
            tile.classList.add("bottonBorder");
        } 
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("righBorder");
        }
        //add tile to the board
        id("board").appendChild(tile);
       
        }
    }
    function updateMove() {
        //if a tile and number is selcted
        if (selectedTile && selectedNum) {
            //set the tile to the correct  number
            selectedTile.textContent = selectedNum.textContent;
            //if the number matches the corresponding number in the solution key
            if (checkCorrect(selectedTile)) {
              //deselects the tile
              selectedTile.classList.remove("selected");
              selectedNum.classList.remove("selected");
              //clear the selected variables
              selectedNum = null;
              selectedTile = null;
              //check if board is complte
              checkDone();
              if (checkDone()) {
                  endGame();
              }
              //if the number does not match the solution key 
            }else {
                //disable selecting new numbers for one second
                disableSelect = true;
                //make the tile trun red
                selectedTile.classList.add("incorrect");
                //run in one second
                setTimeout(function() {
                    //subtract the lives by one
                    lives --;
                    //if no lives left end the game
                    if (lives == 0) {
                        endGame();
                    }else {
                        //if lives is not equal to zero
                        //update the lives text
                        id("lives").textContent = "lives Remaining: " + lives;
                        disableSelect = false;
                    }
                    //restore tile color aad remove seclected from both
                    selectedTile.classList.remove("incorrect");
                    selectedTile.classList.remove("selected");
                    selectedNum.classList.remove("selected");
                    //clear the tiles text and clear selcted variables
                    selectedTile.textContent = "";
                    selectedTile = null;
                    selectedNum = null;   
                }, 1000);
            }
        }
    }

    function checkDone() {
        let tiles = qsa(".tile");
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].textContent === "") return false;   
        }
        return true;
    }


    function endGame() {
        //disable moves and start the timer
        disableSelect = true;
        clearTimeout(timer);
        //display win or loss message
        if (lives === 0 || timeRemaining === 0) {
            id("lives").textContent = "You lost :(";
        }else {
            id("lives").textContent = "You won :D";
        }
    }
    function checkCorrect(tile) {
        //set solution based on difficulty seletion
        let solution;
        if (id("diff-1").checked) solution = Easy[1];
        else if (id("diff-2").checked)solution = Medium[1];
        else solution = Hard[1];
        //if tile's number is equal to solution's number
        if (solution.charAt(tile.id) === tile.textContent) return true;
        else return false;
    }

function clearPrevious() {
    //access all the tiles
    let tiles = qsa(".tile");
    //remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    // if there is a timer cear it
    if (timer) clearTimeout(timer);
    //deselect any numbers
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    //clear selected variables
    selectedTile = null;
    selectedNum = null;
}

//helper Functions
function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}