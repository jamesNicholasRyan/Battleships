const section = document.querySelector('section')

class Board {
  constructor(rows, columns, width, boardNum) {
    this.rows = rows,
    this.columns = columns,
    this.width = width
    this.cells = []
    this.boardNum = boardNum
    // this.displayCounter = 6
  }

  display() {
    // create grid to hold board
    const grid = document.createElement('div')
    grid.classList.add ('grid')
    section.appendChild(grid)
    for (let i = 1; i < this.rows + 1; i++) {
      for (let j = 1; j < this.columns + 1; j++) {
        // create a div and add it to cells[], adding an Id too
        const cell = document.createElement('div')
        const cellID = this.boardNum + ',' + i + ',' + j + ''
        cell.id = cellID
        cell.classList.add('cell')
        grid.appendChild(cell)
        this.cells.push(cell)
        cell.innerHTML = cellID
        cell.style.width = `${100 / this.width}%`
        cell.style.height = `${100 / this.width}%`
      }
    }
    // console.log(this.cells)
  }
}

// --------------------------------------------------------------SHIP CLASS------------------------------------------------------------------------ //

class Ship {
  constructor(type, name, board) {
    this.type = type,
    this.name = name,
    this.position = '',
    this.rotation = false,       // false = horizontal, true = vertical
    this.bodyCells = [],         // the cells that make up the body of the ship
    this.lives = type,
    this.board = board
  }

  display(position) {
    this.bodyCells.push(position)                 // adding 'body' cells to array ...
    const splitPosition = position.split(',')
    for (let i = 1; i < this.type; i++) {         // loop through this as many times as the ship 'type'
      if (this.rotation === false) {              // ship is horizontal
        splitPosition[2] ++
        this.bodyCells.push(splitPosition.join(','))
      } else {                                    // ship is vertical
        splitPosition[1] ++
        this.bodyCells.push(splitPosition.join(','))
      }
    }
    // checking for collisions with wall
    const cellCoordsSlpit = this.bodyCells.toString().split(',')
    console.log('cell body split: ' + cellCoordsSlpit)
    const outOfBounds = cellCoordsSlpit.some((cell) => {
      return (cell > 10 || cell < 1)              // checking array to see if any cells are out of bounds
    })
    // checking for collisions with OTHER ships
    // console.log('this.bodyCells: ' + this.bodyCells)
    // console.log('full cells array: ' + fullCells)
    console.log(this.bodyCells)
    console.log(fullCells)
    const collision = this.bodyCells.some((shipBlock) => {      // searching through fullCells, comparing to every cell in this.bodyCells
      return fullCells.includes(shipBlock)
    })
    console.log('colission: ' + collision + ', outOfBounds: ' + outOfBounds)

    if (!outOfBounds && !collision) {            // if ship isn't out of bounds
      console.log('ship within boundary!')
      if (this.board === 1) {                              // run a function to decrease board specific display counter too display next ship in array
        displayCounter1 --
      } else if (this.board === 2){                        // display next ship in array
        displayCounter2 --
      }
      //decreaseDisplayCounter(this.bodyCells)                                    
      this.bodyCells.forEach((block) => {        // adding body cells to HTML to be visualised
        const cell = document.getElementById(block)
        cell.classList.add('ship')
        fullCells.push(block)                    // adding cells to 'full' array -- they are not taken up by ships
        console.log('adding ship: ' + this.name + ' to ' + position + ' rotation: ' + this.rotation)
      })
    } else {
      console.log('ship out of bounds!')
      this.bodyCells = []                        // emptying array, ready for next placement try
    }
    // console.log(this.bodyCells)
    // console.log(arrayOfFullCells)
    console.log(collision)
  }

  shipHit(cellId) {                     // gets called when the ship is hit
    console.log('ship: ' + this.name + ' has been hit!')
    this.lives --
    const cell = document.getElementById(cellId)
    cell.classList.add('hit')
  }
}

// ----------------------------------------------------------STAGING PHASE------------------------------------------------------------------------------ //

const boardOne = new Board(10, 10, 10, 1)           // create two board objects
const boardTwo = new Board(10, 10, 10, 2)
boardOne.display()                               // display the two boards
boardTwo.display()

const carrier1 = new Ship(5, 'Carrier1', 1)                // creating ships
const battleship1 = new Ship(4, 'Battleship1', 1)    
const destroyer1 = new Ship(3, 'Destroyer1', 1)
const submarineOne1 = new Ship(2, 'Submarine1', 1)
const submarineTwo1 = new Ship(2, 'Submarine1', 1)
const patrolBoatOne1 = new Ship(2, 'Patrol Boat1', 1)
const patrolBoatTwo1 = new Ship(2, 'Patrol Boat1', 1)

const carrier2 = new Ship(5, 'Carrier2', 2)           
const battleship2 = new Ship(4, 'Battleship2', 2)    
const destroyer2 = new Ship(3, 'Destroyer2', 2)
const submarineOne2 = new Ship(2, 'Submarine2', 2)
const submarineTwo2 = new Ship(2, 'Submarine2', 2)
const patrolBoatOne2 = new Ship(2, 'Patrol Boat2', 2)
const patrolBoatTwo2 = new Ship(2, 'Patrol Boat2', 2)

const fullCells = []
const arrayOfShips1 = []
const arrayOfShips2 = []                
// arrayOfShips1.push(carrier1, battleship1, destroyer1, submarineOne1, submarineTwo1, patrolBoatOne1, patrolBoatTwo1)  // adding test ships to array
// arrayOfShips2.push(carrier2, battleship2, destroyer2, submarineOne2, submarineTwo2, patrolBoatOne2, patrolBoatTwo2)  // two arrays for each board
arrayOfShips1.push(carrier1)            // shorter array for testing
arrayOfShips2.push(carrier2)            // shorter array for testing

const gameState = 0
let playerOneTurn = true         
let playerTwoTurn = false

let displayCounter1 = arrayOfShips1.length-1
let displayCounter2 = arrayOfShips2.length-1

const rotateButton1 = document.getElementById('rotate1')     // rotate ship button board one
const rotateButton2 = document.getElementById('rotate2')     // rotate ship button board two
const nextTurnButton = document.querySelector('.nextTurnButton') // submit button
const attackPhaseButton = document.querySelector('.attackPhase')

rotateButton1.addEventListener('click', () => {              
  rotateShips(1)
})
rotateButton2.addEventListener('click', () => {              
  rotateShips(2)
})
attackPhaseButton.addEventListener('click', () => {
  attackPhase()
})
// nextTurnButton.addEventListener('click', () => {
//   stagePhase(boardTwo)
// })
function rotateShips(board) {
  if (board === 1) {
    console.log('rotating ship on board 1')
    arrayOfShips1[displayCounter1].rotation = !arrayOfShips1[displayCounter1].rotation
  } else if (board === 2) {
    console.log('rotating ship on board 2')
    arrayOfShips2[displayCounter2].rotation = !arrayOfShips2[displayCounter2].rotation
  }
}


function stagePhase(board) {                           // stage phase function
  console.log(board)
  board.cells.forEach((cell) => {
    console.log('added eventlistener to cell: ' + cell.id)
    cell.addEventListener('click', () => {            // add eventlistener to each cell in certain board
      console.log('cell selected: ' + cell.id)
      selectShip(cell.id, board)                      // select ship from array
    })
  })

  function selectShip(cellId, board) {
    if (board.boardNum === 1) {                       // checking which board the ships are being placed on
      displayCounter = displayCounter1                // board one uses ship array 1, and display counter 1
      arrayOfShips = arrayOfShips1
    } else if (board.boardNum === 2){
      displayCounter = displayCounter2
      arrayOfShips = arrayOfShips2
    }
    console.log(board.boardNum + ' counter: ' + displayCounter)
    if (displayCounter >= 0) {                         // if there are ships left to add then display the next one
      console.log('adding ship type: ' + arrayOfShips[displayCounter].type)
      arrayOfShips[displayCounter].display(cellId)     // run display method within ship object
      console.log(arrayOfShips)
    } else if (displayCounter <= 0) {
      console.log('no more ships left!')
    }
  }
}

//function decreaseDisplayCounter(shipPosition) {
  // shipPositionArray = shipPosition.join(',').split(',')
  // shipBoard = shipPositionArray[0]
  // if (parseInt(shipBoard) === 1) {
  //   displayCounter1 --
  // } else if (parseInt(shipBoard) === 2){
  //   displayCounter2 --
  // }
//}

stagePhase(boardOne)
stagePhase(boardTwo)

// ------------------------------------------------------------ATTACK PHASE------------------------------------------------------------------ //

const unavailableCells = []

function removeEventListeners(board) {                   // removing eventlistener from each cell in certain board
  board.cells.forEach((cell) => {
    console.log('removing eventlistener for cell: ' + cell.id)
    cell.removeEventListener('click', () => {            // removing eventlistener from each cell in certain board
      // console.log('cell selected: ' + cell.id)
      selectShip(cell.id, board)                    
    })
  })
  // const listeners = window.getEventListeners(document.body)      // list all event listeners?
  // Object.keys(listeners).forEach(event => {
  //   console.log(event, listeners[event]);
// });
}

function attackPhase() {                                   // attack phase start function
  if (displayCounter1 < 0 && displayCounter2 < 0) {        // checks wether all ships have been placed
    console.log('Attack time!')
    removeEventListeners(boardOne)                         // removes eventlisteners from staging phase
    removeEventListeners(boardTwo)
    attackTurns()
  } else {
    console.log('Not all ships placed yet!')
  }
}

function removeHover(board) {                
  board.cells.forEach((cell) => {
    cell.classList.remove('hover')
  })
}

function addHover(board) {                                              // hover/attack function for each cell in specific board
  board.cells.forEach((cell) => {
    cell.addEventListener('mouseover', () => {
      removeHover(board)                                                // reset board first
      const cellOnBoard = document.getElementById(cell.id)  
      // console.log('hovering over cell: ' + cell.id)
      cellOnBoard.classList.add('hover')                                // add hover class to cell
    })
    cell.addEventListener('click', function() {attackCheck(cell.id)})   // add attack listener
  })
}

function attackCheck(cellId) {
  if (!unavailableCells.includes(cellId)) {     // check if cell has been attacked already (if it has, it will be in unavailableCells array)
    unavailableCells.push(cellId)
    // console.log(unavailableCells)
    // console.log('cell: ' + cellId + ' attacked!')
    if (fullCells.includes(cellId)) {          // if player attacks cell that is in full cell array, it is a hit! 
      console.log('SHIP HIT!!')
      const fullShipArray = arrayOfShips1.concat(arrayOfShips2)    // make an array of ALL ships (to check)
      const hitShip = findShip(fullShipArray, cellId)              // check both arrays to find ship that was hit
      hitShip.shipHit(cellId)                                      // call shipHit method in ship class
      attackTurns()                                                // call next turn
    } else {
      console.log('MISS!!')
      const cell = document.getElementById(cellId)
      cell.classList.add('miss')
      attackTurns()
    }
  } else {
    console.log(unavailableCells)
    console.log('cell already attacked!')
  }
}

// ---------------------------------------------------------ALTERNATING TURN LOGIC-------------------------------------------------------------- //

function attackTurns() {
  if (playerOneTurn === true) {
    addHover(boardTwo)                                     // add hover/attack function to board TWO
    boardTwo.cells.forEach((cell) => {                     // remove eventlisteners from other board
      cell.removeEventListener('click', function() {attackCheck(cell.id)})
    })
    listEvenListeners()
    playerOneTurn = false
    playerTwoTurn = true
  } else if (playerTwoTurn === true) {
    addHover(boardOne)                                     // add hover/attack function to board ONE
    boardOne.cells.forEach((cell) => {                     // remove eventlisteners from other board
      cell.removeEventListener('click', function() {attackCheck(cell.id)})
    })
    playerTwoTrun = false
    playerOneTurn = true
  }
}

// -----------------------------------------------------------FIND SHIP FUNCTION----------------------------------------------------------------- //

function findShip(shipArray, cellId) {      // a function to find which ship is being actioned on
  let foundShip = ''
  shipArray.forEach((ship) => {
    if (ship.bodyCells.some((cell) => cell === cellId)) {       // search every ship and look for actioned cell
      foundShip = ship
    } else {
      console.log('no match found')
    }
  })
  console.log('match found: ' + foundShip)
  if (foundShip !== '') {                    // if a ship is found, return that ship
    return foundShip
  }
}



// --------------------------------------------------------LIST EVENT-LISTENERS----------------------------------------------------------------- //

function listEvenListeners() {
  const listeners = (function listAllEventListeners() {
    let elements = [];
    const allElements = document.querySelectorAll('*');
    const types = [];
    for (let ev in window) {
      if (/^on/.test(ev)) types[types.length] = ev;
    }
  
    for (let i = 0; i < allElements.length; i++) {
      const currentElement = allElements[i];
      for (let j = 0; j < types.length; j++) {
        if (typeof currentElement[types[j]] === 'function') {
          elements.push({
            "node": currentElement,
            "listeners": [ {
              "type": types[j],
              "func": currentElement[types[j]].toString(),
            }]
          });
        }
      }
    }
  
    return elements.filter(element => element.listeners.length)
  })();
  
  console.log('current event listeners: ' + listeners);
  
}







