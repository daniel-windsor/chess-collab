//Return array of cells a piece can move to
function getMoves(target) {
  //Find row and col of selected
  let cell = target
  if (cell.tagName === "I") {
    cell = target.parentNode
  }
  const cellCoord = target.parentNode.className.split(' ')[1].split('')
  const row = Number(cellCoord[1])
  const col = Number(cellCoord[3])

  //Find type and colour of piece
  const type = target.classList[1].split('-')[2]
  const colour = getColour(target)

  const possibleMoves = []

  switch (type) {
    case "pawn":
      possibleMoves.push(...pawnMoves(row, col, colour))
      break;
    case "rook":
      possibleMoves.push(...maxStraight(row, col, colour))
      break;
    case "knight":
      possibleMoves.push(...knightMoves(row, col, colour))
      break;
    case "bishop":
      possibleMoves.push(...maxDiagonal(row, col, colour))
      break;
    case "queen":
      possibleMoves.push(...maxStraight(row, col, colour), ...maxDiagonal(row, col, colour))
      break;
    case "king":
      possibleMoves.push(...kingMoves(row, col, colour))
      break;
  }

  return possibleMoves;
}

//Handles pawn movement
function pawnMoves(row, col, colour) {
  let arr = []

  if (row == 0 || row == 7) { //Stops error when pawn reaches other side
    return arr
  }

  let direction = colour == "white" ? -1 : 1 //find direction pawn needs to move in based on colour

  if (!document.querySelector(`.c${row+direction}x${col}`).children[0]) {
    arr.push(`.c${row+direction}x${col}`)
  }

  if ((colour == "white" && row == 6) || (colour == "black" && row == 1)) {
    if (!document.querySelector(`.c${row+direction*2}x${col}`).children[0] && !document.querySelector(`.c${row+direction}x${col}`).children[0]) {
      arr.push(`.c${row+(direction*2)}x${col}`)
    }
  }

  //attacking
  let diag = [`.c${row+direction}x${col-1}`, `.c${row+direction}x${col+1}`] //get squares 1 row ahead and each side

  for (let i = 0; i < diag.length; i++) {
    if (document.querySelector(diag[i])) {
      let children = document.querySelector(diag[i]).children
      if (children[0] && !children[0].classList.contains(colour)) {
        arr.push(diag[i])
      }
    }
  }


  return arr
}

//Handles knight movement
function knightMoves(row, col, colour) {
  const moveSet = [
    [2, 1],
    [2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
    [-2, 1],
    [-2, -1]
  ]

  const moves = moveSet.map(el => `.c${row + (el[0] % 8)}x${col + el[1]}`)
    .filter(el => document.querySelector(el))
    .filter(el => !document.querySelector(el).children[0] || !document.querySelector(el).children[0].classList.contains(colour))

  return moves
}

//Handles king movement
function kingMoves(row, col, colour) {
  const moveSet = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ]

  const moves = moveSet.map(el => `.c${row + (el[0] % 8)}x${col + el[1]}`)
    .filter(el => document.querySelector(el))
    .filter(el => !document.querySelector(el).children[0] || !document.querySelector(el).children[0].classList.contains(colour))

  return moves
}

//Finds how far a piece can go straight
function maxStraight(row, col, colour) {

  const moves = {
    north: [],
    south: [],
    east: [],
    west: []
  }

  for (let i = 1; i < 8; i++) { //Gets coords for all cells within 8 cells in all directions
    moves.north.push(`.c${row-i}x${col}`)
    moves.south.push(`.c${row+i}x${col}`)
    moves.east.push(`.c${row}x${col+i}`)
    moves.west.push(`.c${row}x${col-i}`)
  }

  return [...filterMaxMoves(moves, colour)]
}

//Finds how far a piece can go diagonally
function maxDiagonal(row, col, colour) {

  const moves = {
    north: [], //northeast     -- can't rename these because it breaks the filter
    east: [], //southeast
    south: [], //southwest
    west: [] //northwest
  }

  for (let i = 1; i < 8; i++) {
    moves.north.push(`.c${row-i}x${col+i}`)
    moves.east.push(`.c${row+i}x${col+i}`)
    moves.south.push(`.c${row+i}x${col-i}`)
    moves.west.push(`.c${row-i}x${col-i}`)
  }

  return [...filterMaxMoves(moves, colour)]
}

//Ensures pieces don't try to move where they aren't allowed
function filterMaxMoves(arr, colour) {

  const moves = {
    north: [],
    south: [],
    east: [],
    west: []
  }

  const finalArray = []

  for (let move in arr) {
    moves[move].push(...arr[move].filter(el => document.querySelector(el))) //Ensures no cells are out of bounds

    let index = moves[move].findIndex(el => document.querySelector(el).children[0]) //Finds index of first cell with a child

    if (index != -1) {
      let childColour = getColour(document.querySelector(moves[move][index]).children[0])
      if (childColour != colour) {
        finalArray.push(...moves[move].slice(0, index + 1))
      } else {
        finalArray.push(...moves[move].slice(0, index))
      }
    } else {
      finalArray.push(...moves[move])
    }
  }

  return finalArray
}

function movePiece(evt) {
  const originalCell = document.querySelector('.selected')

  let destinationCell = ""
  if (typeof (evt) === "string") {
    destinationCell = document.querySelector(evt)
  } else {
    destinationCell = evt.target
    if (destinationCell.tagName === "I") {
      destinationCell = evt.target.parentNode
    }
  }

  if (destinationCell.children[0]) {
    capturePiece(destinationCell)
  }

  const movingPiece = originalCell.removeChild(originalCell.children[0]) //remove the child on the (home)cell, place in destinationCell
  destinationCell.append(movingPiece)

  removeHighlight()

  if (movingPiece.classList.contains('fa-chess-pawn')) {
    promoteMe(destinationCell)
  }

  winCondition()

  turnManager(getColour(movingPiece))

}