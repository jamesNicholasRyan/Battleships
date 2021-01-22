### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive
# BATTLESHIPS <img src= assets/Explosion.png height=50 width=50 />

## Overview
This was my first front-end development project, created as part of General Assembly's Software Engineering Immersive bootcamp.

My task was to create a grid-based game renderd in the browser that utilised Javascript, HTML and CSS. I decided to create an online version of the classic game Battleships. 

Try it out [here](https://jamesnicholasryan.github.io/Battleships/)! 

The game was to be created as a solo project and completed within one week.


## Brief
- **Render a game in the browser**
- **Design logic for winning** & **visually display which player won**
- **Include separate HTML / CSS / JavaScript files**
- Stick with **KISS (Keep It Simple Stupid)** and **DRY (Don't Repeat Yourself)** principles
- Use **Javascript** for **DOM manipulation**
- **The game should be one player, with the computer placing its pieces randomly at the start of the game**
- **The computer should be able to make random attacks on the player's board**

When I had a basic game complete, I aimed for these extra goals:
- Responsive design, for mobile and web
- More intelligent attacks by the computer
- Visual enhancements (ship indicators etc.)


## Technologies used
- Javascript (ES6)
- HTML5
- CSS
- Pro Tools (for SFX editing and mixing)
- GIMP (for pixel art and details)
- Git & GitHub


# Approach

## Planning
Before writing a single line of code, I planned extensively for the week ahead. I outlined the core foundations of the game I would like to make by the end of the week:
- There will be two boards, one for the player and one for the computer.
- The game will have **three stages**: *preparation stage*, *attacking phase* & *end game*
  - During the **preparation phase**, the player will place ships (ships must be able to rotate). The computer will place ships randomly during this phase, without collision or overlapping. 
  - The **attacking phase** will start once all ships are placed. In this pahse the players take turns to attack cells on each other's boards.
  - When either players ships are all destroyed, the game **ends**

## Grid
At the heart of the game is the grid system, where all of the action takes plce. For the grid layout I decided to proceed with a *cartesian* type coordinate system, with the origin at the top left of the grid. This would make searching for neighbouring cells and position much easier than a simple list of cells. Each cell was assigned an *ID* that corresponded of - 'board number', 'column' ('j') and 'row' ('i').

- I created a **Board** *class* which contained this *display* method:
```js
  display() {
    const gridId = '#grid' + this.boardNum
    const grid = document.querySelector(gridId)
    for (let i = 1; i < this.rows + 1; i++) {
      for (let j = 1; j < this.columns + 1; j++) {
        const cell = document.createElement('div')
        const cellID = this.boardNum + ',' + j + ',' + i + ''
        cell.id = cellID
        if (this.boardNum === 1) {                        
          cell.classList.add('cell')
        } else if (this.boardNum === 2) {
          cell.classList.add('blackCell')
        }
        grid.appendChild(cell)
        this.cells.push(cell)
        cell.style.width = `${100 / this.width}%`
        cell.style.height = `${100 / this.width}%`
      }
    }
  }
```

## Preparation Phase
To allow for dynamic rotation and placement of the ships, I decided to create a **Ship** *class*. Each **Ship** had 7 keys: *type*, *name*, *poisition*, *rotation*, *bodyCells*, *lives* and *board*.

- When called apon, each ship had a method that works out the correct orientation and placement of the ships *body cells*, depending on their *position* & *type* (length):
```js
 createBodyCells(position) {                  
    this.bodyCells = [] 
    this.bodyCells.push(position) 
    const splitPosition = position.split(',')
    for (let i = 1; i < this.type; i++) {   
      if (this.rotation === false) {   
        splitPosition[1] ++                         
        this.bodyCells.push(splitPosition.join(','))
      } else {                            
        splitPosition[2] ++
        this.bodyCells.push(splitPosition.join(','))
      }
    }
  }
```

- As with the **Board** class, each **Ship** has a *display* mathod. Within this method, there are collision checks for the edges and other ships. I used an array called 'fullCells' to determine which cells had ships in them:
```js
  const cellCoordsSlpit = this.bodyCells.toString().split(',')
  const outOfBounds = cellCoordsSlpit.some((cell) => {
    return (cell > 10 || cell < 1) 
  })
  const collision = this.bodyCells.some((shipBlock) => {      
    return fullCells.includes(shipBlock)
  })
```

Ship placement for the AI is exactly the same as the players', however, the process is completely random - if the computer comes across collisions, the AI will repeat the methods until no collisions are found:

- I have a *const* **displayCounter2** that keeps track of which ships are being placed
```js
function computerStage() {
  let availableCells = []
  boardTwo.cells.forEach((cell) => availableCells.push(cell))                    
  const randomNum = Math.round(Math.random() * (availableCells.length - 1))
  const randomCell = availableCells[randomNum]
  const randomCellId = randomCell.id
  const randomRotation = Math.round(Math.random() * 1) + 1 
  rotateShips(randomRotation)
  arrayOfShips2[displayCounter2].display(randomCellId, 'placement')  
  availableCells = availableCells.filter((cell) => {   
    return cell !== randomCell
  })
  while (displayCounter2 >= 0) { 
    computerStage()
  }
}
```

## Attack Phase