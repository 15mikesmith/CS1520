
//Ask for Player 1 info
var playerOne = prompt("Please enter your name","Player 1");


var input = prompt("Please enter your ship placement. Rows go from  1 to 10 and Columns go from A to J");



var p1Ships = input.split(';');

//Extract AirCarrier coordinates

var p1AircraftCarrier = [];
var p1Battleship = [];
var p1Submarine = [];
//Have list to contain ship hitCount

var p1AircraftCarrierHitCount = 0;
var p1BattleshipHitCount = 0;
var p1SubmarineHitCount = 0;


extractShip(p1AircraftCarrier,0,p1Ships);
extractShip(p1Battleship,1,p1Ships);
extractShip(p1Submarine,2,p1Ships);


function extractShip(ship,num,mainInput){
var currentShip = mainInput[num]

//console.log(currentShip);

if((currentShip[1] == '(') || (currentShip[1] == ':')){
    var sub1 = mainInput[num];
    sub1 = sub1.substring(2,4);
    var sub2 = mainInput[num];
    sub2 = sub2.substring(5,7);

    var x =  sub1[0].toUpperCase().charCodeAt(0) - 65;
    var y =  sub2[0].toUpperCase().charCodeAt(0) - 65;
    x = x+sub1[1];
    y = y+sub2[1];


ship.push(sub1);

if(x[0]==y[0]){
      for (var i = x[1]; i+1 < y[1]; i++) {
        var currBoat = parseInt(i)+1;
        console.log(currBoat);
      //  ship.push(String.fromCharCode(x[0] + 65)+currBoat);
        ship.push(sub1[0]+currBoat);
      }
    ship.push(sub2);
  }else{
    for (var i = sub1[0].toUpperCase().charCodeAt(0) - 65; i+1 < sub2[0].toUpperCase().charCodeAt(0) - 65; i++) {
      var currBoat = parseInt(i)+1;
      currBoat = String.fromCharCode(currBoat + 65)
      console.log(currBoat);
      //ship.push(String.fromCharCode(currBoat + 65)+sub1[1]);
      ship.push(currBoat+sub1[1]);
    }
  ship.push(sub2);
  }
}
else{


    var test = currentShip.split(',');

    for (var i = 0; i < test.length; i++) {
      ship[i] = test[i].replace(':','');
    }



}
console.log(ship);
}





//Ask for Player 2 info
var playerTwo = prompt("Please enter your name","Player 2");

input = prompt("Please enter your ship placement. Rows go from  1 to 10 and Columns go from A to J");

var p2Ships = input.split(';');


//Extract AirCarrier coordinates

var p2AircraftCarrier = [];
var p2Battleship = [];
var p2Submarine = [];

var p2AircraftCarrierHitCount = 0;
var p2BattleshipHitCount = 0;
var p2SubmarineHitCount = 0;


extractShip(p2AircraftCarrier,0,p2Ships);
extractShip(p2Battleship,1,p2Ships);
extractShip(p2Submarine,2,p2Ships);




var rows = 10;
var cols = 10;
var squareSize = 50;

// get the container element
var gameBoardContainer = document.getElementById("gameboard");

// make the grid columns and rows
for (i = 0; i < cols; i++) {
	for (j = 0; j < rows; j++) {

		// create a new div HTML element for each grid square and make it the right size
		var square = document.createElement("div");
    square.style.backgroundColor = '#87CEFA'
		gameBoardContainer.appendChild(square);

    // give each div element a unique id based on its row and column, like "s00"
		square.id = 's' + j + i;

		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;

		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';
	}
}

/*increment hitCount on every hit
   12 hits need to be made in order to win the game:
      Carrier     - 5 hits
      Battleship  - 4 hits
      Submarine   - 3 hits
*/
var hitCount = 0;


//2d array which conatins the status of each square div on the GameBoard
//0 means empty, 1 means part of a ship, 2 means part of a hit ship, 3 is  means a missed shot

var gameBoard = [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
				]

//Place Player ships on the board

var data = [];

placeOnBoard(p1AircraftCarrier,gameBoard);
placeOnBoard(p1Battleship,gameBoard);
placeOnBoard(p1Submarine,gameBoard);

data.push.apply(data, p1AircraftCarrier);
data.push.apply(data, p1Battleship);
data.push.apply(data, p1Submarine);

//Check if user have overlapping ships


if(findDuplicates(data).length != 0){
  window.alert(playerOne+" has entered overlapping ships, please refresh the window to restart the game");
}
console.log( findDuplicates(data));

//console.log( findDuplicates([1, 2, 3, 1, 2, 1]) ); // [1, 2]

//console.log(gameBoard)


// set event listener for all elements in gameboard, run click function when square is clicked
gameBoardContainer.addEventListener("click", click, false);
//}


//Create Second GameBoard

var gameBoardContainer2 = document.getElementById("gameboard2");

for (i = 0; i < cols; i++) {
	for (j = 0; j < rows; j++) {
    var square2 = document.createElement("div");
  square2.style.backgroundColor = '#87CEFA'
  gameBoardContainer2.appendChild(square2);
    square2.id = 't' + j + i;

// set each grid square's coordinates: multiples of the current row or column number
    var topPosition = j * squareSize;
    var leftPosition = i * squareSize;

// use CSS absolute positioning to place each grid square on the page
    square2.style.top = topPosition + 'px';
    square2.style.left = leftPosition + 'px';
  }
}

var hitCount2 = 0;

//2d array which conatins the status of each square div on the GameBoard
//0 means empty, 1 means part of a ship, 2 means part of a hit ship, 3 is  means a missed shot

var gameBoard2 = [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
				]


var data2 = [];
//Place the player's ships on the board
        placeOnBoard(p2AircraftCarrier,gameBoard2);
        placeOnBoard(p2Battleship,gameBoard2);
        placeOnBoard(p2Submarine,gameBoard2);

        data2.push.apply(data2, p2AircraftCarrier);
        data2.push.apply(data2, p2Battleship);
        data2.push.apply(data2, p2Submarine);
        //Check if user have overlapping ships
        //findDuplicates(data2);

        if(findDuplicates(data2).length != 0){
          window.alert(playerTwo+" has entered overlapping ships, please refresh the window to restart the game");
        }
        console.log( findDuplicates(data2));

        // set event listener for all elements in gameboard, run click function when square is clicked
        gameBoardContainer2.addEventListener("click", click2, false);


        switchClicks("s");
        window.alert("Click to begin "+playerOne+"\'s turn");


        //Show battleships
        //console.log(gameBoard)

        revealShip(p1AircraftCarrier,gameBoard,"A","s");
        revealShip(p1Battleship,gameBoard,"A","s");
        revealShip(p1Submarine,gameBoard,"A","s");

        var p1Score = 0;
        var p2Score = 0;



        function findDuplicates(data) {

          let result = [];

          data.forEach(function(element, index) {

            // Find if there is a duplicate or not
            if (data.indexOf(element, index + 1) > -1) {

              // Find if the element is already in the result array or not
              if (result.indexOf(element) === -1) {
                result.push(element);
              }
            }
          });

          return result;
        }








          //Add player's score in local storage, if length is 10 then remove the lowest one

        function addScore(name,score){

          // var array = [
          //   ["Mike",24],
          //   ["Sarah",18],
          //   ["Carol",22]
          //   ];
          //var name
          var toAdd = [name,parseInt(score)];



          if(JSON.parse(localStorage.getItem("array")) == null){
            var array = [];
          }else{
            var array = JSON.parse(localStorage.getItem("array"));
          }



          if(array.length < 10){

              array.push(toAdd);
          }

          if(array.length == 10){
        //if(array.length == 3){


              var lowest = array[0];
              var where = 0;
              //console.log(lowest);
              for (var i = 0; i < array.length; i++) {
                //console.log(lowest[1]);
                //console.log(array[i][1]);
                if(lowest[1] > array[i][1]){
                  lowest = array[i];
                  where = i;
                }
              }
            //  console.log(lowest);
              if(lowest[1] < score){

                array.splice(where, 1);
                array.push(toAdd);

                //localStorage.setItem([name,score]);
              }
              console.log(array);

          }

//Stringify and add to localStorage
          localStorage.setItem("array", JSON.stringify(array));

        }



          //Find the ID of the box that has been hit, If there is a ship placed there
          //and it is hit the max amount of times then inform user that it is sunk

          function whoGotHit(id,player){

            //console.log(id);
            var pos = document.getElementById(id);
            //console.log(pos.innerHTML);
            //console.log(player);

            if(player == 1){
              switch (pos.innerHTML) {
                case "A":
                if(p1AircraftCarrierHitCount == 4){
                  window.alert(playerOne+" sank "+ playerTwo +"\'s AirCarrier");
                //  window.alert("Player 1 sank Player 2's AirCarrier");
                }else {
                  p1AircraftCarrierHitCount++;
                }
                  break;

                case "B":
                if(p1BattleshipHitCount == 3){
                  window.alert(playerOne+" sank "+ playerTwo +"\'s Battleship");
                  //window.alert("Player 1 sank Player 2's Battleship");
                }else {
                  p1BattleshipHitCount++;
                }
                  break;

                case "S":
                if(p1SubmarineHitCount == 2){
                  window.alert(playerOne+" sank "+ playerTwo +"\'s Submarine");
                  //window.alert("Player 1 sank Player 2's Submarine");
                }else {
                  p1SubmarineHitCount++;
                }
                  break;

              }
            }else{
              switch (pos.innerHTML) {
                case "A":
                if(p2AircraftCarrierHitCount == 4){
                  window.alert(playerTwo+" sank "+ playerOne +"\'s AirCarrier");

                //  window.alert("Player 2 sank Player 2's AirCarrier");
                }else {
                  p2AircraftCarrierHitCount++;
                }
                  break;

                case "B":
                if(p2BattleshipHitCount == 3){
                  window.alert(playerTwo+" sank "+ playerOne +"\'s Battleship");

                  //window.alert("Player 2 sank Player 1's Battleship");
                }else {
                  p2BattleshipHitCount++;
                }
                  break;

                case "S":
                if(p2SubmarineHitCount == 2){
                  window.alert(playerTwo+" sank "+ playerOne +"\'s Submarine");
                  //window.alert("Player 2 sank Player 1's Submarine");
                }else {
                  p2SubmarineHitCount++;
                }
                  break;

              }
            }

          }


          //Loop through the player's gameboard and draw the ship's specific character on the board


        function revealShip(ship,board, letter,player){
          for(i = 0; i < ship.length; i++){
            currChars = ship[i].split('');
            if(currChars.length == 2){
            var x =  currChars[0].toUpperCase().charCodeAt(0) - 65;
            var y = currChars[1] - 1;
          }
          else {
            var x =  currChars[0].toUpperCase().charCodeAt(0) - 65;
            var y = currChars[1] + currChars[2] - 1;
          }
          var pos = document.getElementById(player+y+x); //.innerHTML = letter;
          if(ship.length == 5){
          pos.innerHTML = "A";
        }
        else if (ship.length == 4) {
          pos.innerHTML = "B";
        }else{
          pos.innerHTML = "S";
        }
        }
      }


      //Loop through the gameboard and remove the ships letters

      function removeShip(ship,board, letter,player){
        for(i = 0; i < ship.length; i++){
          currChars = ship[i].split('');
          if(currChars.length == 2){
          var x =  currChars[0].toUpperCase().charCodeAt(0) - 65;
          var y = currChars[1] - 1;
        }
        else {
          var x =  currChars[0].toUpperCase().charCodeAt(0) - 65;
          var y = currChars[1] + currChars[2] - 1;
        }
        var pos = document.getElementById(player+y+x); //.innerHTML = letter;
        pos.innerHTML = "";

      }
    //  console.log(pos);
    }



        var list = document.getElementById("container");

        function swapBoards(flag){
          var list = document.getElementById("container");
          if(flag == 1){
            list.insertBefore(gameBoardContainer2,list.childNodes[7]);
            list.insertBefore(gameBoardContainer,list.childNodes[14]);
          }else{
            list.insertBefore(gameBoardContainer2,list.childNodes[14]);
            list.insertBefore(gameBoardContainer,list.childNodes[7]);
          }
        }



//Disable or Enable the board between the two players
function switchClicks(letter){
        for (i = 0; i < cols; i++) {
        	for (j = 0; j < rows; j++) {
              var boxToStop = document.getElementById(letter+ j + i);
              boxToStop.classList.toggle("avoid-clicks");
              //console.log(boxToStop)
          }
        }
      }


//Modify the gameboard to place the ships by turning the position of the ships 1

function placeOnBoard(ship,board) {

var data = [];

  for(i = 0; i < ship.length; i++){
    currChars = ship[i].split('');
    //console.log(currChars);
    if(currChars.length == 2){
    var x =  currChars[0].toUpperCase().charCodeAt(0) - 65;
    var y = currChars[1] - 1;
  }
  else {
    var x =  currChars[0].toUpperCase().charCodeAt(0) - 65;
    var y = currChars[1] + currChars[2] - 1;
  }
    board[y][x] = 1;

  }

}


//Event handler for when a user clicks a square

function click(e) {
	if (e.target !== e.currentTarget) {
        // extract row and column # from the HTML element's id
		var row = e.target.id.substring(1,2);
		var col = e.target.id.substring(2,3);
        //alert("Clicked on row " + row + ", col " + col);

		// if player clicks a square with no ship, change the color and change square's value
		if (gameBoard[row][col] == 0) {
			e.target.style.background = 'white';
			// set this square's value to 3 to indicate that they fired and missed
			gameBoard[row][col] = 3;
      window.alert("MISS");
      switchClicks("s");
      window.alert("Click to begin "+playerOne+"\'s turn");
      switchClicks("t");
      swapBoards(1);
      removeShip(p2AircraftCarrier,gameBoard2,"A","t");
      removeShip(p2Battleship,gameBoard2,"A","t");
      removeShip(p2Submarine,gameBoard2,"A","t");

      revealShip(p1AircraftCarrier,gameBoard,"A","s");
      revealShip(p1Battleship,gameBoard,"A","s");
      revealShip(p1Submarine,gameBoard,"A","s");



		// if player clicks a square with a ship, change the color and change square's value
		} else if (gameBoard[row][col] == 1) {
			e.target.style.background = 'red';
			// set this square's value to 2 to indicate the ship has been hit
			gameBoard[row][col] = 2;
      window.alert("HIT");
      switchClicks("s");
      window.alert("Click to begin "+playerOne+"\'s turn");
      switchClicks("t");
      swapBoards(1);
      removeShip(p2AircraftCarrier,gameBoard2,"A","t");
      removeShip(p2Battleship,gameBoard2,"A","t");
      removeShip(p2Submarine,gameBoard2,"A","t");

      revealShip(p1AircraftCarrier,gameBoard,"A","s");
      revealShip(p1Battleship,gameBoard,"A","s");
      revealShip(p1Submarine,gameBoard,"A","s");

      //Find which ship got hits
      whoGotHit(e.target.id,2);


			// increment hitCount each time a ship is hit
			p2Score++;
			// this definitely shouldn't be hard-coded, but here it is anyway. lazy, simple solution:
			if (p2Score == 12) {
        alert("All enemy battleships have been destroyed, "+ playerTwo + " wins with a score of "+ (24 - (p1Score *2)));
        addScore(playerTwo,(24 - (p1Score *2)));
        //localStorage.setItem(playerTwo,(24 - (p1Score *2)));

			}


		// if player clicks a square that's been previously hit, let them know
		} else if (gameBoard[row][col] > 1) {
			alert("You already fired at this location.");
		}
    }
    e.stopPropagation();
    //window.alert("Click to begin "+playerTwo+ " turn")

}

function click2(e) {
	if (e.target !== e.currentTarget) {
        // extract row and column # from the HTML element's id
		var row = e.target.id.substring(1,2);
		var col = e.target.id.substring(2,3);
        //alert("Clicked on row " + row + ", col " + col);

		// if player clicks a square with no ship, change the color and change square's value
		if (gameBoard2[row][col] == 0) {
			e.target.style.background = 'white';
			// set this square's value to 3 to indicate that they fired and missed
			gameBoard2[row][col] = 3;
      window.alert("MISS");
      switchClicks("t");
      window.alert("Click to begin "+playerTwo+"\'s turn");
      switchClicks("s")
      swapBoards(0);
      removeShip(p1AircraftCarrier,gameBoard,"A","s");
      removeShip(p1Battleship,gameBoard,"A","s");
      removeShip(p1Submarine,gameBoard,"A","s");

      revealShip(p2AircraftCarrier,gameBoard2,"A","t");
      revealShip(p2Battleship,gameBoard2,"A","t");
      revealShip(p2Submarine,gameBoard2,"A","t");

		// if player clicks a square with a ship, change the color and change square's value
  } else if (gameBoard2[row][col] == 1) {
			e.target.style.background = 'red';
			// set this square's value to 2 to indicate the ship has been hit
			gameBoard2[row][col] = 2;
      window.alert("HIT");



      switchClicks("t");
      window.alert("Click OK begin "+playerTwo+"\'s turn");
      switchClicks("s");
      swapBoards(0);
      removeShip(p1AircraftCarrier,gameBoard,"A","s");
      removeShip(p1Battleship,gameBoard,"A","s");
      removeShip(p1Submarine,gameBoard,"A","s");

      revealShip(p2AircraftCarrier,gameBoard2,"A","t");
      revealShip(p2Battleship,gameBoard2,"A","t");
      revealShip(p2Submarine,gameBoard2,"A","t");

      //Find which ship got hits
      whoGotHit(e.target.id,1);


			// increment hitCount each time a ship is hit
			p1Score++;
			// this definitely shouldn't be hard-coded, but here it is anyway. lazy, simple solution:
			if (p1Score == 12) {
				alert("All enemy battleships have been destroyed, "+ playerOne + " wins with a score of "+ (24 - (p2Score *2)));
        addScore(playerOne,(24 - (p2Score *2)));
        //localStorage.setItem(playerOne,(24 - (p2Score *2)));

			}


		// if player clicks a square that's been previously hit, let them know
  } else if (gameBoard2[row][col] > 1) {
			alert("You already fired at this location.");
		}
    }
    e.stopPropagation();


}
