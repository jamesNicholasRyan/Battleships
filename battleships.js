const section = document.querySelector('section')

class Board {
  constructor(rows, columns, width) {
    this.rows = rows,
    this.columns = columns,
    this.width = width
    this.cells = []
    // this.boardNum = boardNum
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
        const cellID = '' + i + ',' + j + ''
        cell.id = cellID
        cell.classList.add('cell')
        grid.appendChild(cell)
        this.cells.push(cell)
        cell.innerHTML = cellID
        cell.style.width = `${100 / this.width}%`
        cell.style.height = `${100 / this.width}%`
      }
    }
    console.log(this.cells)
  }
}

// ------------------------------------------------------------------------- //

class Ship {
  constructor(type, name) {
    this.type = type,
    this.name = name,
    this.position = '',
    this.rotation = false,      // false = horizontal, true = vertical
    this.bodyCells = [],
    this.lives = type 
  }

  display(position) {
    this.bodyCells.push(position)              // adding 'body' cells to array ...
    const splitPosition = position.split(',')
    for (let i = 1; i < this.type; i++) {      // loop through this as many times as the ship 'type'
      if (this.rotation === false) {           // ship is horizontal
        splitPosition[1] ++
        this.bodyCells.push(splitPosition.join(','))
      } else {                                 // ship is vertical
        splitPosition[0] ++
        this.bodyCells.push(splitPosition.join(','))
      }
    }
    // checking for collisions with wall
    const cellCoordsSlpit = this.bodyCells.toString().split(',')
    const outOfBounds = cellCoordsSlpit.some((cell) => {
      return (cell > 10 || cell < 1)              // checking array to see if any cells are out of bounds
    })
    // checking for collisions with OTHER ships
    let collision = false
    this.bodyCells.forEach((shipBlock) => {
      collision = arrayOfFullCells.some((cell) => {     // searching through arrayOfFullCells, comparing to every cell in this.bodyCells
        return shipBlock === cell                      // collision returns true if there is a match
      })
    })
    console.log(collision)

    if (!outOfBounds && !collision) {                         // if ship isn't out of bounds
      console.log('ship within boundary!')
      displayCounter --                          // display next ship in array
      this.bodyCells.forEach((block) => {        // adding body cells to HTML to be visualised
        const cell = document.getElementById(block)
        cell.classList.add('ship')
        arrayOfFullCells.push(block)             // adding cells to 'full' array -- they are not taken up by ships
        console.log('adding ship: ' + this.name + ' to ' + position)
      })
    } else {
      console.log('ship out of bounds!')
      this.bodyCells = []                    // emptying array, ready for next placement try
    }
  }
}

// ---------------------------------------------------------------------------- //

const boardOne = new Board(10, 10, 10) // create two board objects
const boardTwo = new Board(10, 10, 10)
boardOne.display()                     // display the two boards
boardTwo.display()

const carrier = new Ship(5, 'Carrier')         // creatig three test ship objects
const battleship = new Ship(4, 'Battleship')    
const destroyer = new Ship(3, 'Destroyer')
const submarineOne = new Ship(2, 'Submarine')
const submarineTwo = new Ship(2, 'Submarine')
const patrolBoatOne = new Ship(2, 'Patrol Boat')
const patrolBoatTwo = new Ship(2, 'Patrol Boat')

const arrayOfFullCells = []
const arrayOfShips = []                
arrayOfShips.push(carrier, battleship, destroyer, submarineOne, submarineTwo, patrolBoatOne, patrolBoatTwo)  // adding test ships to array
console.log(arrayOfShips)


let displayCounter = arrayOfShips.length - 1
const rotateButton = document.querySelector('.rotateButton')
rotateButton.addEventListener('click', () => {              // rotate ship button
  // console.log('ship: ' + arrayOfShips[counter] + 'rotation: ' + arrayOfShips[counter].rotation)
  arrayOfShips[displayCounter].rotation = !arrayOfShips[displayCounter].rotation
})

function selectShip(cellId) {
  console.log('counter: ' + displayCounter)
  if (displayCounter >= 0) {
    console.log('adding ship type: ' + arrayOfShips[displayCounter].type)
    arrayOfShips[displayCounter].display(cellId)
  } else {
    console.log('no more ships left!')
  }
}

boardOne.cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    // add function here that selects ship from list
    // that essentially does this: testShip.display(cell.id)
    console.log('cell selected: ' + cell.id)
    selectShip(cell.id)
  })
})


