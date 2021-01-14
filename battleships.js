const section = document.querySelector('section')

class Board {
  constructor(rows, columns, width, boardNum) {
    this.rows = rows,
    this.columns = columns,
    this.width = width
    this.cells = []
    this.boardNum = boardNum
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

// ------------------------------------------------------------------------------------------------------------------- //

class Ship {
  constructor(type, name) {
    this.type = type,
    this.name = name,
    this.position = '',
    this.rotation = false,       // false = horizontal, true = vertical
    this.bodyCells = [],
    this.lives = type 
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
    const outOfBounds = cellCoordsSlpit.some((cell) => {
      return (cell > 10 || cell < 1)              // checking array to see if any cells are out of bounds
    })
    // checking for collisions with OTHER ships
    // console.log(this.bodyCells)
    // console.log(fullCells)
    const collision = this.bodyCells.some((shipBlock) => {      // searching through fullCells, comparing to every cell in this.bodyCells
      return fullCells.includes(shipBlock)
    })
    // console.log(collision)

    if (!outOfBounds && !collision) {            // if ship isn't out of bounds
      console.log('ship within boundary!')
      displayCounter --                          // display next ship in array
      this.bodyCells.forEach((block) => {        // adding body cells to HTML to be visualised
        const cell = document.getElementById(block)
        cell.classList.add('ship')
        fullCells.push(block)                    // adding cells to 'full' array -- they are not taken up by ships
        console.log('adding ship: ' + this.name + ' to ' + position)
      })
    } else {
      console.log('ship out of bounds!')
      this.bodyCells = []                        // emptying array, ready for next placement try
    }
    // console.log(this.bodyCells)
    // console.log(arrayOfFullCells)
    console.log(collision)
  }
}

// ---------------------------------------------------------------------------------------------------------------- //

const boardOne = new Board(10, 10, 10, 1)           // create two board objects
const boardTwo = new Board(10, 10, 10, 2)
boardOne.display()                               // display the two boards
boardTwo.display()

const carrier1 = new Ship(5, 'Carrier')           
const battleship1 = new Ship(4, 'Battleship')    
const destroyer1 = new Ship(3, 'Destroyer')
const submarineOne1 = new Ship(2, 'Submarine')
const submarineTwo1 = new Ship(2, 'Submarine')
const patrolBoatOne1 = new Ship(2, 'Patrol Boat')
const patrolBoatTwo1 = new Ship(2, 'Patrol Boat')
// const carrier2 = new Ship(5, 'Carrier')           
// const battleship2 = new Ship(4, 'Battleship')    
// const destroyer2 = new Ship(3, 'Destroyer')
// const submarineOne2 = new Ship(2, 'Submarine')
// const submarineTwo2 = new Ship(2, 'Submarine')
// const patrolBoatOne2 = new Ship(2, 'Patrol Boat')
// const patrolBoatTwo2 = new Ship(2, 'Patrol Boat')

const fullCells = []
const arrayOfShips = []                
arrayOfShips.push(carrier1, battleship1, destroyer1, submarineOne1, submarineTwo1, patrolBoatOne1, patrolBoatTwo1)  // adding test ships to array

const gameState = 0
let playerOneTurn = true         
let playerTwoTrun = false

let displayCounter = arrayOfShips.length - 1
const rotateButton = document.querySelector('.rotateButton')
rotateButton.addEventListener('click', () => {              // rotate ship button
  // console.log('ship: ' + arrayOfShips[counter] + 'rotation: ' + arrayOfShips[counter].rotation)
  arrayOfShips[displayCounter].rotation = !arrayOfShips[displayCounter].rotation
})

function selectShip(cellId) {
  console.log('counter: ' + displayCounter)
  if (displayCounter >= 0) {                         // if there are ships left to add then display the next one
    console.log('adding ship type: ' + arrayOfShips[displayCounter].type)
    arrayOfShips[displayCounter].display(cellId)
  } else if (displayCounter <= 0) {
    console.log('no more ships left!')
    console.log('next players turn')
    playerOneTurn = false
  }
}

function stagePhase(board) {
  console.log(board)
  board.cells.forEach((cell) => {
    console.log('added eventlistener to cell: ' + cell.id)
    cell.addEventListener('click', () => {
      console.log('cell selected: ' + cell.id)
      selectShip(cell.id)                      // select ship from array
    })
  })
}

stagePhase(boardTwo)
//stagePhase(boardTwo)





