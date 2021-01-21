const section = document.querySelector('section')
const infoBar = document.querySelector('.infoText')
const infoBar2 = document.querySelector('.infoText2')
infoBar.innerHTML = 'HELLO WORLD'
const livesBarOne = document.querySelector('.playerLivesBar')
const livesBarTwo = document.querySelector('.computerLivesBar')
const livesOne = document.querySelector('.playerOneLivesNum')      // update lives in HTML
const livesTwo = document.querySelector('.playerTwoLivesNum')      // update lives in HTML
const audioPlayer = document.querySelector('audio')
audioPlayer.volume = 0.3

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
    const gridId = '#grid' + this.boardNum
    const grid = document.querySelector(gridId)
    // grid.classList.add ('grid')
    // section.appendChild(grid)
    for (let i = 1; i < this.rows + 1; i++) {
      for (let j = 1; j < this.columns + 1; j++) {
        // create a div and add it to cells[], adding an Id too
        const cell = document.createElement('div')
        const cellID = this.boardNum + ',' + j + ',' + i + ''
        cell.id = cellID
        if (this.boardNum === 1) {                        // checking which board is being created - black board for board 2
          cell.classList.add('cell')
          console.log('board one cells')
        } else if (this.boardNum === 2) {
          cell.classList.add('blackCell')
          console.log('board two cells')
        }
        grid.appendChild(cell)
        this.cells.push(cell)
        // cell.innerHTML = cellID
        cell.style.width = `${100 / this.width}%`
        cell.style.height = `${100 / this.width}%`
        // cell.backgroundImage = '.images/waterTile1.png'
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

  createBodyCells(position) {                     // creating ship body
    this.bodyCells = []                           // clearing everytime this function is called, it may be called more than once!
    this.bodyCells.push(position)                 // adding 'body' cells to array ...
    const splitPosition = position.split(',')
    for (let i = 1; i < this.type; i++) {         // loop through this as many times as the ship 'type'
      if (this.rotation === false) {              // ship is horizontal
        splitPosition[1] ++
        this.bodyCells.push(splitPosition.join(','))
      } else {                                    // ship is vertical
        splitPosition[2] ++
        this.bodyCells.push(splitPosition.join(','))
      }
    }
  }

  display(position, displayType) {
    this.createBodyCells(position)                 // function for creating ship body above
    const cellCoordsSlpit = this.bodyCells.toString().split(',')
    // console.log('cell body split: ' + cellCoordsSlpit)
    const outOfBounds = cellCoordsSlpit.some((cell) => {
      return (cell > 10 || cell < 1)              // checking array to see if any cells are out of bounds
    })
    //console.log('this.bodyCells: ')                   // checking for collisions with OTHER ships
    //console.log(this.bodyCells)
    const collision = this.bodyCells.some((shipBlock) => {      // searching through fullCells, comparing to every cell in this.bodyCells
      return fullCells.includes(shipBlock)
    })
    //console.log('colission: ' + collision + ', outOfBounds: ' + outOfBounds)

    if (!outOfBounds && !collision) {                        // if ship isn't out of bounds
      //console.log('ship within boundary!')
      if (displayType === 'placement') {                     // if display type = placement, decrement displaycounter
        if (this.board === 1) {                              // run a function to decrease board specific display counter too display next ship in array
          displayCounter1 --
          const capitalisedName = this.name.toUpperCase()
          const annoucement = `PLACED: ${capitalisedName}`   // annouce ship that has been placed
          flashText(annoucement, infoBar2, 6)                // use flash function
          if (this.name === 'submarine') {
            audioPlayer.src = `./sounds/sub.mp3`       // if the ship being placed is a submarine, play sub sound
            audioPlayer.play()
          } else {
            audioPlayer.src = `./sounds/ship.mp3`       // if the ship being placed is a submarine, play sub sound
            audioPlayer.play()
          }
        } else if (this.board === 2){                        // display next ship in array
          displayCounter2 --
        }
      }

      let counter = 1                                  
      this.bodyCells.forEach((block) => { 
        if (displayType === 'placement') {                   // check if ship is being placed or hover display       
          fullCells.push(block)                              // adding cells to 'full' array -- they are not taken up by ships
          if (this.board === 1) {
            const partName = this.name + counter             // creating class name according to ship type & length
            //console.log(partName)
            counter ++
            const cell = document.getElementById(block)      // adding body cells to HTML to be visualised (only if they are Human's ships)
            cell.classList.add(partName)                     // visual CSS variable here
            cell.classList.add('ship')                       // used for attacking functions later!
            if (this.rotation === true) {                    // rotate cell/image if ship is rotated
              cell.classList.add('rotate')
            }         
          }
        } else if (displayType === 'hover') {              // -------------- HOVER DISPLAY HERE!! ----------------- //
          //console.log('hover display!')
          const cell = document.getElementById(block)      // adding body cells to HTML to be visualised for HOVER ONLY HERE!!
          cell.classList.add('shipHoverExt')               // adding hover CSS class to cells
        }
        //console.log('adding ship: ' + this.name + ' to ' + position + ' rotation: ' + this.rotation)
      })
    } else {
      //console.log('ship out of bounds!')
      infoBar2.innerHTML = 'SHIP OUT OF BOUNDS'
      this.bodyCells = []                        // emptying body cells array, ready for next placement try
    }
    // console.log(this.bodyCells)
    // console.log(arrayOfFullCells)
    // console.log(collision)
  }

  shipHit(cellId) {                             // gets called when the ship is hit
    //console.log('ship: ' + this.name + ' has been hit!')
    this.lives --
    console.log('ship lives: ')
    console.log(this.name + ' ' + this.lives)
    if (this.lives === 0) {                         // when ship is completely sunk...
      const shipName = this.name.toUpperCase()
      if (this.board === 1) {
        const announcement = `YOUR ${shipName} HAS BEEN SUNK!`              // indicate when your ship has sunk
        flashText(announcement, infoBar2, 5)
      } else if (this.board === 2) {
        const announcement = `COMPUTER ${shipName} HAS BEEN SUNK!`              // indicate when your ship has sunk
        flashText(announcement, infoBar2, 5)
      }
      const shipId = this.name + this.board
      const outlineClass = this.name + 'Out' + this.board
      const shipItem = document.getElementById(shipId)
      const outline = document.querySelector(`.${outlineClass}`)        // change outlines of ships when destroyed
      shipItem.classList.add('red')
      const redOutlineClass = `${this.name}Red`
      flash(outline, redOutlineClass, 14, 400)                   // flash function requires: ITEM to flash, CLASS to toggle flash, DURATION of flash
    }

    const cell = document.getElementById(cellId)
    const newCell = document.createElement('div')             // create a new cell ontop of old cell
    cell.appendChild(newCell)                                 // creating/adding HIT art!
    //newCell.classList.add('hit')                              
    newCell.style.position = 'absolute'

    if (playerOneTurn === false) {                       // change player lives accordingly
      playerOneLives --
      newCell.classList.add('hitCellClass')
      flash(newCell, 'hit', 10, 200)                          // flash function requires: ITEM to flash, CLASS to toggle flash, DURATION of flash
      audioPlayer.src = `./sounds/hit.mp3`       // if the ship being placed is a submarine, play sub sound
      audioPlayer.play()
    } else {
      playerTwoLives --
      flash(cell, 'radarHit', 10, 200)                        // flash function requires: ITEM to flash, CLASS to toggle flash, DURATION of flash
      audioPlayer.src = `./sounds/radarHit.mp3`       // if the ship being placed is a submarine, play sub sound
      audioPlayer.play()
    }
    percentage()                                                       // work out new lives percentage
    
    livesOne.innerHTML = playerPercentage
    livesTwo.innerHTML = computerPercentage

    const newWidth = Math.round((160/17) * playerOneLives)
    livesBarOne.style.width = `${newWidth}px`
    const newWidth2 = Math.round((160/17) * playerTwoLives)
    livesBarTwo.style.width = `${newWidth2}px`
  }
}

// ----------------------------------------------------------SET UP------------------------------------------------------------------------------ //

const boardOne = new Board(10, 10, 10, 1)           // create two board objects
const boardTwo = new Board(10, 10, 10, 2)
boardOne.display()                           // display the two boards
boardTwo.display()

const zAxisBlocker1 = document.createElement('div')  // create a blocker for alternating turns
const zAxisBlocker2 = document.createElement('div')
const grid1 = document.querySelector('#grid1')
const grid2 = document.querySelector('#grid2')
grid1.appendChild(zAxisBlocker1)             // add blocker to computers board (board that player attacks on)
grid2.appendChild(zAxisBlocker2)
zAxisBlocker1.classList.add('zAxisOff')      // adding z axis class to blocker (starts in off state)
zAxisBlocker2.classList.add('zAxisOff')

const carrier1 = new Ship(5, 'carrier', 1)                // creating ships
const battleship1 = new Ship(4, 'battleship', 1)    
const destroyer1 = new Ship(3, 'destroyer', 1)
const submarineOne1 = new Ship(3, 'submarine', 1)
const patrolBoatOne1 = new Ship(2, 'patrolBoat', 1)

const carrier2 = new Ship(5, 'carrier', 2)           
const battleship2 = new Ship(4, 'battleship', 2)    
const destroyer2 = new Ship(3, 'destroyer', 2)
const submarineOne2 = new Ship(3, 'submarine', 2)
const patrolBoatOne2 = new Ship(2, 'patrolBoat', 2)

let fullCells = []
let unavailableCells = []
let notAttacked = []
let notAttackedFiltered = []
let homeCell = []
const arrayOfShips1 = []
const arrayOfShips2 = []  
let frontier = []
let xOrY = 0
let hit = false
let computerDifficulty = 1

arrayOfShips1.push(carrier1, battleship1, destroyer1, submarineOne1, patrolBoatOne1)  // adding test ships to array
arrayOfShips2.push(carrier2, battleship2, destroyer2, submarineOne2, patrolBoatOne2)  // two arrays for each board

function playerLives(array) {                           // function to find player lives from ship types
  const typeArray = []
  array.forEach((ship) => {
    typeArray.push(ship.type)
  })
  return typeArray.reduce((acc, type) => {
    return acc + type
  }, 0)
}

function percentage() {
  const playerPer = Math.round((parseInt(playerOneLives)/17)*100)
  const compPer = Math.round((parseInt(playerTwoLives)/17)*100)
  playerPercentage =  `${playerPer}%`
  computerPercentage =  `${compPer}%`
}

let gameState = 0
let turnCount = 0
let playerOneTurn = true         
let playerTwoTurn = false
let playerOneLives = playerLives(arrayOfShips1)                       // player lives = sum of all ship types
let playerTwoLives = playerLives(arrayOfShips2)
let playerPercentage = '100%'
let computerPercentage = '100%'
const playerLight = document.querySelector('.playerTurnLight')
const computerLight = document.querySelector('.computerTurnLight')

let displayCounter1 = arrayOfShips1.length-1
let displayCounter2 = arrayOfShips2.length-1

const rotateButton1 = document.getElementById('rotate1')              // rotate ship button board one
const rotateButton2 = document.getElementById('rotate2')              // rotate ship button board two
const nextTurnButton = document.querySelector('.nextTurnButton')      // submit button
const attackPhaseButton = document.querySelector('.attackPhase')      // next phase button
const resetButton = document.querySelector('.resetButton')
const saveButton = document.querySelector('.saveButtonContainer')
const scores = document.querySelector('.scores')
let saveState = false

addAttack(boardTwo)  // calling this ONCE per game! at the start and never again

function setUp() {                  // -------------------- function to reset/set up game ------------------ //
  gameState = 0
  turnCount = 0
  console.log('game set up')
  //zAxisBlocker.classList.add('zAxisOn')        // turns zAxis blocker on
  zAxisBlocker1.classList.remove('zAxisOn')      // adding z axis class to blocker (starts in off state)
  zAxisBlocker2.classList.add('zAxisOn')
  frontier = []
  xOrY = 0                                          // direction of attack for computer, 0=Y-, 1=X+, 2=Y+, 3=X- 
  hit = false                                             
  displayCounter1 = arrayOfShips1.length-1
  displayCounter2 = arrayOfShips2.length-1
  playerOneTurn = true         
  playerTwoTurn = false
  playerOneLives = playerLives(arrayOfShips1)        // player lives = sum of all ship types
  playerTwoLives = playerLives(arrayOfShips2)
  playerPercentage = '100%'
  computerPercentage = '100%'
  const newWidth = Math.round((160/17) * playerOneLives)
  livesBarOne.style.width = `${newWidth}px`
  const newWidth2 = Math.round((160/17) * playerTwoLives)
  livesBarTwo.style.width = `${newWidth2}px`
  livesOne.innerHTML = playerPercentage                // initialising lives on page start up
  livesTwo.innerHTML = computerPercentage
  fullCells = []                                     // empty full cells array
  unavailableCells = []
  notAttacked = []
  notAttackedFiltered = []
  homeCell = []
  saveState = false
  // boardOne.display()                                 // display the two boards
  // boardTwo.display()
  boardOne.cells.forEach((cell) => notAttacked.push(cell))                        // creating array of available cells 
  boardOne.cells.forEach((cell) => {              // clearing each cell
    cell.className = ''
    cell.classList.add('cell')
  })
  boardTwo.cells.forEach((cell) => {
    cell.className = ''
    cell.classList.add('blackCell')
  })
  const fullShipArray = arrayOfShips1.concat(arrayOfShips2)
  fullShipArray.forEach((ship) => {
    ship.bodyCells = []
  })

  fullShipArray.forEach((ship) => ship.lives = ship.type)                         // resetting ship lives
  
  const shipOutlines = Array.from(document.querySelectorAll('.outline'))            // reseting ship outlines
  shipOutlines.forEach((outline) => {
    arrayOfShips1.forEach((ship) => {
      const outlineRed = ship.name + 'Red'
      outline.classList.remove(outlineRed)
    })
  })
  const shipItems = Array.from(document.querySelectorAll('.itemShip'))
  console.log(shipItems)
  shipItems.forEach((ship) => ship.classList.remove('red'))

  const hitCellArray = Array.from(document.querySelectorAll('.hitCellClass'))       // finds all hit cells on board
  hitCellArray.forEach((cell) => {                                                  // for each hitcell, find the parent and remove the hit cell from the parent
    const parent = cell.parentNode
    const throwawayNode = parent.removeChild(cell)
  })

  let counter = 0
  for (i=0; i<100; i+=2) {                                 // creating a checked attacking choices for optimised computer
    if (counter === 5) {
      i++
    } else if (counter === 10) {
      counter = 0
      i--
    }
    counter ++
    notAttackedFiltered.push(notAttacked[i])
    // const cell = notAttacked[i]
    // const cellId = cell.id
    // const tempCell = document.getElementById(cellId)
    // tempCell.style.background = 'red'
  }
  saveButton.style.visibility = 'hidden'
  displayScores()

  console.log(notAttacked)
  console.log(notAttackedFiltered)
  removeHover(boardOne)
  removeHover(boardTwo)  
  placingHover()
  stagePhase(boardOne)                         // ----------- STAGE PHASE call -------- //
  computerStage()
}

rotateButton1.addEventListener('click', () => {              
  rotateShips(1)
})

attackPhaseButton.addEventListener('click', () => {
  gameState = 1
  attackPhase()
})
resetButton.addEventListener('click', () => {
  setUp()
  // playerTwoLives = 0
})
saveButton.addEventListener('click', ()=> {                                  // saving and displaying scores
  if (saveState) {
    const date = new Date().toLocaleTimeString()
    const dateText = `${winner} ---- turns:`
    const turnsTaken = Math.round(turnCount/2)
    const score = `${dateText} ${turnsTaken}`
    // scoreText = `${date} ---- turns: ${score}`
    window.localStorage.setItem(date, score)
    while(scores.firstChild){
      scores.removeChild(scores.firstChild)
    }
    displayScores()
  }
  saveState = false
})

// localStorage.clear();

function displayScores() {
  const arrayOfScores = Object.entries(localStorage).map(e => e[1]).sort((a,b) => a-b)
  arrayOfScores.forEach((score) => {
    const li = document.createElement('li')
    li.innerHTML = score
    scores.appendChild(li)
  })
}

setUp()

function rotateShips(board) {                      // function for rotating ships
  if (board === 1) {
    //console.log('rotating ship on board 1')
    arrayOfShips1[displayCounter1].rotation = !arrayOfShips1[displayCounter1].rotation
  } else if (board === 2) {
    //console.log('rotating ship on board 2')
    arrayOfShips2[displayCounter2].rotation = !arrayOfShips2[displayCounter2].rotation
  }
}

// ----------------------------------------------------------STAGING PHASE------------------------------------------------------------------------------ //

function stagePhase(board) {                           // stage phase function
  infoBar.innerHTML = 'PREPARATION PHASE'
  const announcement = 'PLACE YOUR SHIPS NOW'     
  flashText(announcement, infoBar2, 5)
  //console.log(board)
  board.cells.forEach((cell) => {
    const domCell = document.getElementById(cell.id)
    // console.log('added eventlistener to cell: ' + cell.id)
    domCell.addEventListener('click', () => {         // add eventlistener to each cell in certain board
      //console.log('cell selected: ' + cell.id)
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
    //console.log(board.boardNum + ' counter: ' + displayCounter)
    if (displayCounter >= 0) {                         // if there are ships left to add then display the next one
      //console.log('adding ship type: ' + arrayOfShips[displayCounter].type)
      arrayOfShips[displayCounter].display(cellId, 'placement')     // run display method within ship object
      //console.log(arrayOfShips)
    } else if (displayCounter <= 0) {
      const announcement = 'NO MORE SHIPS LEFT TO PLACE'     
      flashText(announcement, infoBar2, 5)
      //console.log('no more ships left!')
    }
  }
}

function placingHover() {                                // adding the full hover experience for the staging phase
  boardOne.cells.forEach((cell) => {
    if (displayCounter1 >= 0) {                          // if there are still ships to add ...
      cell.addEventListener('mouseover', () => {         // add eventlistener to each cell
        removeHover(boardOne)
        cellId = cell.id
        const currentShip = arrayOfShips1[displayCounter1]   // get current selected ship
        currentShip.display(cellId, 'hover')                 // display ship, type hover
      })
    }
  })
}

// ---------------------------------------------------------COMPUTER STAGE PHASE------------------------------------------------------------- //

function computerStage() {
  let availableCells = []
  boardTwo.cells.forEach((cell) => availableCells.push(cell))                              // creating array of available cells for placement 
  const randomNum = Math.round(Math.random() * (availableCells.length - 1))
  const randomCell = availableCells[randomNum]                                             // randomly select a cell from available cells array
  const randomCellId = randomCell.id
  const randomRotation = Math.round(Math.random() * 1) + 1                                 // add random rotation here
  rotateShips(randomRotation)
  arrayOfShips2[displayCounter2].display(randomCellId, 'placement')                        // display ship as normal
  availableCells = availableCells.filter((cell) => {                                       // filter random cell from available cells
    return cell !== randomCell
  })
  while (displayCounter2 >= 0) {                                                           // repeat this process until all ships are placed
    computerStage()
  }
}

// ------------------------------------------------------------ATTACK PHASE------------------------------------------------------------------ //

function removeEventListeners(board) {                       // removing eventlistener from each cell in certain board
  board.cells.forEach((cell) => {
    const domCell = document.getElementById(cell.id)
    domCell.removeEventListener('click', () => {             // removing eventlistener from each cell in certain board
      selectShip(cell.id, board)                    
    })
  })
}

function attackPhase() {                                                        // attack phase start function
  if (displayCounter1 < 0 && displayCounter2 < 0 && (gameState === 1)) {        // checks wether all ships have been placed
    infoBar.innerHTML = 'ATTACK PHASE...'
    const announcement = 'YOUR TURN'
    flashText(announcement, infoBar2, 10)
    removeEventListeners(boardOne)                                              // removes eventlisteners from staging phase
    removeEventListeners(boardTwo)
    addHover(boardOne)
    addHover(boardTwo) 
    zAxisBlocker2.classList.remove('zAxisOn')                 // switching blocker on and off between boards
    zAxisBlocker1.classList.add('zAxisOn')
    attackTurns()
  } else {
    const announcement = 'SOME SHIPS ARE STILL TO BE PLACED!'
    flashText(announcement, infoBar2, 10)
  }
}

function removeHover(board) {                       // function REMOVES HOVER class from tiles      
  board.cells.forEach((cell) => {
    cell.classList.remove('hover')
    cell.classList.remove('shipHoverExt')
  })
}

function addHover(board) {                                             // hover/attack function for each cell in specific board
  board.cells.forEach((cell) => {
    cell.classList.add('hover')
  })
}

function addAttack(board) {
  board.cells.forEach((cell) => {
    cell.addEventListener('mousedown', function() {attackCheck(cell.id)})       // add attack listener
  })
}

function attackCheck(cellId) {
  console.log('ATTACK CHECK BEING CALLED')
  //console.log('attacking cell: ' + cellId)
  //console.log(unavailableCells)
  console.log(notAttacked)
  console.log(notAttackedFiltered)
  if (!unavailableCells.includes(cellId)) {     // check if cell has been attacked already (if it has, it will be in unavailableCells array)
    unavailableCells.push(cellId)

    if (playerTwoTurn === true) {                                               // if it is the computers turn, take away from not attacked
      const newNotAttackedFiltered = notAttackedFiltered.filter((cell) => cell.id !== cellId)
      const newNotAttacked = notAttacked.filter((cell) => cell.id !== cellId)
      notAttacked = newNotAttacked 
      notAttackedFiltered = newNotAttackedFiltered
    }

    switchLights()
    // console.log(unavailableCells)
    // console.log('cell: ' + cellId + ' attacked!')
    if (fullCells.includes(cellId)) {                // if player attacks cell that is in full cell array, it is a hit!
      if (playerTwoTurn === true) {                  // checking if false because we change the boolean 3 lines above.
        hit = true                                   // if it is computer's turn, change hit to true - only change this when its computer's turn
        //console.log('changing hit reference: ' + hit)
      }
      console.log(cellId)
      console.log('SHIP HIT!!')
      flashText('SHIP HIT!', infoBar2, 11)
      const fullShipArray = arrayOfShips1.concat(arrayOfShips2)    // make an array of ALL ships (to check)
      const hitShip = findShip(fullShipArray, cellId)              // check both arrays to find ship that was hit
      hitShip.shipHit(cellId)                                      // call shipHit method in ship class
      //attackTurns()                                              // call next turn
    } else {
      console.log(cellId)
      console.log('MISS!!')
      flashText('MISS!', infoBar2, 11)
      const cell = document.getElementById(cellId)
      if (playerOneTurn === true) {
        flash(cell, 'radarMiss', 10)
        audioPlayer.src = `./sounds/radarMiss.mp3`      
        audioPlayer.play()
      } else if (playerTwoTurn === true) {
        flash(cell, 'miss', 10)
        audioPlayer.src = `./sounds/miss1.mp3`         
        audioPlayer.play()
        hit = false                                    // if it is computer's turn, change hit to false
      }
    }

    playerOneTurn = !playerOneTurn
    playerTwoTurn = !playerTwoTurn

    if (playerTwoTurn === false) {
      //console.log('computing AI logic...')
      aIAttack(cellId)
    }
    if (playerOneTurn === false) {
      console.log('----- END OF PLAYER ONE TURN -----')
    } else {
      console.log('***** END OF COMPUTER TURN *****')
    }

    console.log('ATTACK TURNS BEING CALLED.....')
    setTimeout(attackTurns, 0)

  } else if (unavailableCells.includes(cellId)) {
    const announcement = 'CELL ALREADY ATTACKED!'
    flashText(announcement, infoBar2, 10)
    console.log('cell already attacked!' + cellId)
    if (playerTwoTurn === true) {    
      frontier.shift()
    }
    console.log('ATTACK TURNS BEING CALLED.....')
    setTimeout(attackTurns, 0)
  }

}

// --------------------------------------------------AI LOGIC---------------------------------------------------- //
function aIAttack(cellId) {
  console.log('frontier: ')
  console.log(frontier)
  if (frontier.length === 0) {                                                               // if frontier is empty, computer has no targets yet
    if (hit === true) {                                                                      // check to see if the computer had hit anything
      homeCell = []
      homeCell.push(cellId)                                                                  // set home cell as originally attacked cell
      // console.log(homeCell)
      // console.log('successful attack, adding to frontier...')
      // frontier = []
      const idSplit = cellId.split(',')
      const idSplitX = parseInt(idSplit[1])                                                  // finding location of hit cell
      const idSplitY = parseInt(idSplit[2])
      const top = '1,' + (idSplitX) + ',' + (idSplitY - 1)                                   // finding neighbouring cells
      const right = '1,' + (idSplitX + 1) + ',' + (idSplitY)
      const bottom = '1,' + idSplitX + ',' + (idSplitY + 1)
      const left = '1,' + (idSplitX - 1) + ',' + idSplitY
      frontier.push(top, right, bottom, left)                                                // staging cells before adding them to frontier
      frontier.forEach((cell) => {
        //console.log('checking cell: ' + cell.split(','))
        if ((cell.split(',').some((num) => (num > 10) || (num < 1)))) {                      // chekcing if the cells are on the board                                                 // chekcing if the cells have been attacked before
          frontier.splice(frontier.indexOf(cell), 1)                                         // removing cells from frontier if they are not on the board
        }
        if (unavailableCells.includes(cell)) {
          frontier.splice(frontier.indexOf(cell), 1)
        }
      })
    } else {
      const announcement = 'COMPUTER HAS MISSED ... AND IS VERY SAD :('
      flashText(announcement, infoBar2, 10)
      //console.log ('computer has missed and is very sad!')
    }
  } else if (frontier.length > 0) {                                                     // if frontier isn't empty, there are targets to attack
    frontier.shift()                                                                    // removing cell from frontier - cell that was just attacked
    if (hit === true) {                                                                 // check to see if the computer had hit anything
      //console.log('hit: ' + hit)
      //const homeCell = cellId                                                         // memory for original cell attacked that created frontier - to get direction of attack
      const cellToAttackSplit = cellId.split(',')
      let cellToAttackSplitX = parseInt(cellToAttackSplit[1])                               // getting X and Y coordds of cell
      let cellToAttackSplitY = parseInt(cellToAttackSplit[2])
      if (xOrY === 0) {                                                                 // check which direction the computer was attacking
        const newCellToAttack = '1,' + cellToAttackSplitX + ',' + (cellToAttackSplitY - 1)       // creating new cell from direction of attack
        frontier.unshift(newCellToAttack)                                                     // add new cell to FRONT of frontier
      } else if (xOrY === 1) {
        const newCellToAttack = '1,' + (cellToAttackSplitX + 1) + ',' + cellToAttackSplitY      // creating new cell from direction of attack
        frontier.unshift(newCellToAttack)                                                     // add new cell to FRONT of frontier
      } else if (xOrY === 2) {
        const newCellToAttack = '1,' + cellToAttackSplitX + ',' + (cellToAttackSplitY + 1)      // creating new cell from direction of attack
        frontier.unshift(newCellToAttack)                                                     // add new cell to FRONT of frontier
      } else if (xOrY === 3) {
        const newCellToAttack = '1,' + (cellToAttackSplitX - 1) + ',' + cellToAttackSplitY       // creating new cell from direction of attack
        frontier.unshift(newCellToAttack)                                                     // add new cell to FRONT of frontier
      }
      frontier.forEach((cell) => {
        if ((cell.split(',').some((num) => (num > 10) || (num < 1)))) {                      // chekcing if the cells are on the board                                                 // chekcing if the cells have been attacked before
          frontier.splice(frontier.indexOf(cell), 1)                                         // removing cells from frontier if they are not on the board
        }
        if (unavailableCells.includes(cell)) {
          frontier.splice(frontier.indexOf(cell), 1)   
        }
      })
      directionFinder()                                                                       // find next direction of attack
    } else {                                                                                  // if there is no hit, note change in direction of attack... 
      console.log('hit: ' + hit)
      directionFinder()                                                                       // find next direction of attack                                                                                  
    }
  }
}

function directionFinder() {                                               // function to find direction of next attack!
  if (frontier.length > 0) {
    //console.log('finding direction to next cell!')
    //console.log('home cell: ' + homeCell[0])
    const directionCellToAttackSplit = frontier[0].split(',')                                            // checking direction of next attack
    const homeCellarray = homeCell[0]
    const homeCellSplit = homeCellarray.split(',')
    const homeCellX = homeCellSplit[1]
    const homeCellY = homeCellSplit[2]
    diffX = parseInt(homeCellX) - parseInt(directionCellToAttackSplit[1])                                    // finding difference between coords for direction
    diffY = parseInt(homeCellY) - parseInt(directionCellToAttackSplit[2])
    if (diffX === 0) {                                                  // if X axis difference doesn't change, the attack direction is along the Y axis
      if (diffY > 0) {                                                  // if Y axis difference is positive, the direction is upwards
        xOrY = 0
      } else if (diffY < 0) {                                           // if Y axis difference is negative, the attack direction is downwards
        xOrY = 2
      }
    } else if (diffY === 0) {                                           // if Y axis difference DOESN'T CHANGE, the attack direction is along the X axis
      if (diffX > 0) {                                                  // if X axis difference is positive, attack direction is LEFT                     
        xOrY = 3
      } else if (diffX < 0) {                                           // if X axis difference is NEGATIVE, attack direction is RIGTH  
        xOrY = 1
      }
    }
  }
}

// ---------------------------------------------------------ALTERNATING TURN LOGIC-------------------------------------------------------------- //

function attackTurns() {
  turnCount ++
  console.log('turn count: ' + turnCount)
  if (playerOneLives <= 0 || playerTwoLives <= 0) {
    endGame()
  } else if ((playerOneTurn === true) && (playerTwoTurn === false)) {                        // check who's turn it is
    console.log('--------- START OF PLAYERS TURN -------')
    console.log('players turn: ' + playerOneTurn)
    console.log('computers turn: ' + playerTwoTurn)
    switchLights()
    setTimeout(() => {
      zAxisBlocker2.classList.remove('zAxisOn')
    }, 3000)                 // switching blocker on and off between boards
    zAxisBlocker1.classList.add('zAxisOn')

  } else if ((playerTwoTurn === true) && (playerOneTurn === false)) {                        // <==== ----------------COMPUTER'S TURN------------ ??
    console.log('************ START OF COMPUTERS TURN ***********')
    console.log('players turn: ' + playerOneTurn)
    console.log('computers turn: ' + playerTwoTurn)
    // console.log(frontier)
    switchLights()
    //zAxisBlocker1.classList.remove('zAxisOn')                 // switching blocker on and off between boards
    zAxisBlocker2.classList.add('zAxisOn')

    let pickCounter = 3
    let computerPicking = 0
    computerPicking = setInterval(() => {                     // interval animation to make it look like the computer is deciding where to go...
      if (pickCounter > 0) {
        console.log('computer deciding where to go...')
        removeHover(boardOne)
        randomPick = Math.floor(Math.random() * (notAttacked.length))
        const randomPickCell = notAttacked[randomPick]
        randomPickCell.classList.add('shipHoverExt')
        console.log(randomPickCell)
        pickCounter --
      } else if (pickCounter === 0) {
        removeHover(boardOne)
        clearInterval(computerPicking)
      }
    }, 400)

    console.log(notAttacked.length)
    console.log(notAttackedFiltered.length)

    setTimeout(() => {
      if ((frontier.length === 0)) {   // -----------------------------!!!! COMPUTER ATTACK LOGIC HERE !!!!------------------------------ //
        console.log('ATTACKING RANDOM')
        xOrY = 0                                                                                   // reset xOrY
        // console.log('frontier empty, potential strategic attack...')
        // let availableCells = []
        // boardOne.cells.forEach((cell) => notAttacked.push(cell))                                // creating array of available cells 
        let randomNum = '0'
        let randomCell = '0'
        if ((computerDifficulty === 0) || (turnCount > 120)) {                                // when turncount gets to specific number, computer starts attacking every cell on board
          randomNum = Math.floor(Math.random() * (notAttacked.length))
          randomCell = notAttacked[randomNum]                                                 // randomly select a cell from available cells array
        } else if (computerDifficulty === 1) {
          randomNum = Math.floor(Math.random() * (notAttackedFiltered.length))
          randomCell = notAttackedFiltered[randomNum]                                                  // randomly select a cell from available cells array
        }
        
        let randomCellId = randomCell.id
        console.log(randomCellId)
        // console.log('ATTACKCHECK BEING CALLED from frontier.length === 0')
        attackCheck(randomCellId)

      } else if ((frontier.length > 0)) {                                                     // if frontier isn't empty, attack cells in frontier!
        // console.log('ATTACKING FRONTIER')
        const cellToAttack = frontier[0]
        // console.log('ATTACKCHECK BEING CALLED from frontier.length > 0')
        attackCheck(cellToAttack)
      }
    }, 1800)

  }
}


// -----------------------------------------------------------FIND SHIP FUNCTION----------------------------------------------------------------- //

function findShip(shipArray, cellId) {      // a function to find which ship is being actioned on
  let foundShip = ''
  shipArray.forEach((ship) => {
    if (ship.bodyCells.some((cell) => cell === cellId)) {       // search every ship and look for actioned cell
      foundShip = ship
    } else {
    }
  })
  if (foundShip !== '') {                    // if a ship is found, return that ship
    return foundShip
  }
}

// ---------------------------------------------------------VISUAL FUNCTIONS------------------------------------------------------------------------- //

function flash(item, className, duration, interval=200) {             // this function takes ITEM to be flahsed, CLASSNAME to toggle, DURATION and INTERVAL (default = 200)
  let counter = duration
  const flash = setInterval(() => {
    counter --
    if (counter > 0) {
      item.classList.toggle(className)
    } else {
      clearInterval(flash)
    }
  }, interval)
}

function flashText(string, element, duration, interval=300) {        // this function flashes the given string within its element
  let counter = duration
  const flash = setInterval(() => {
    counter --
    if (counter > 0) {
      if (element.innerHTML === '') {
        element.innerHTML = string
      } else if (element.innerHTML !== '') {
        element.innerHTML = ''
      }
    } else {
      clearInterval(flash)
    }
  }, interval)
}

function switchLights() {
  if (playerOneTurn === true) {
    playerLight.classList.add('lightOn')
    computerLight.classList.remove('lightOn')
  } else if (playerOneTurn === false) {
    playerLight.classList.remove('lightOn')
    computerLight.classList.add('lightOn')
  }
}

// ---------------------------------------------------------END GAME----------------------------------------------------------------------------- //
let winner = ''

function endGame() {
  zAxisBlocker2.classList.add('zAxisOn')                 // switching blocker on and off between boards
  zAxisBlocker1.classList.add('zAxisOn')
  // let winner = ''
  if (playerOneLives > playerTwoLives) {
    winner = 'YOU'
  } else {
    winner = 'COMPUTER'
  }
  infoBar.innerHTML = `GAME OVER!`
  const announcement = `WINNER: ${winner}`
  flashText(announcement, infoBar2, 41)
  console.log('------------GAME OVER-------------')
  console.log(winner + ' has won!')
  saveState = true
  saveButton.style.visibility = 'visible'
}



