document.addEventListener('DOMContentLoaded', startGame)

//Obj containing piece information
const pieces = {
  pawn: {
    white: {
      starting: [".c6x0", ".c6x1", ".c6x2", ".c6x3", ".c6x4", ".c6x5", ".c6x6", ".c6x7"],
      icon: "<i class='fas fa-chess-pawn w'</i>"
    },
    black: {
      starting: [".c1x0", ".c1x1", ".c1x2", ".c1x3", ".c1x4", ".c1x5", ".c1x6", ".c1x7"],
      icon: '<i class="fas fa-chess-pawn b"</i>'
    }
  },
  rook: {
    white: {
      starting: [".c7x0", ".c7x7"],
      icon: '<i class="fas fa-chess-rook w"></i>'
    },
    black: {
      starting: [".c0x0", ".c0x7"],
      icon: '<i class="fas fa-chess-rook b"></i>'
    }
  },
  knight: {
    white: {
      starting: [".c7x1", ".c7x6"],
      icon: '<i class="fas fa-chess-knight w"></i>'
    },
    black: {
      starting: [".c0x1", ".c0x6"],
      icon: '<i class="fas fa-chess-knight b"></i>'
    }
  },
  bishop: {
    white: {
      starting: [".c4x5", ".c7x5"],
      icon: '<i class="fas fa-chess-bishop w"></i>'
    },
    black: {
      starting: [".c0x2", ".c0x5"],
      icon: '<i class="fas fa-chess-bishop b"></i>'
    }
  },
  queen: {
    white: {
      starting: [".c4x4"],
      icon: '<i class="fas fa-chess-queen w"></i>'
    },
    black: {
      starting: [".c0x4"],
      icon: '<i class="fas fa-chess-queen b"></i>'
    }
  },
  king: {
    white: {
      starting: [".c7x4"],
      icon: '<i class="fas fa-chess-king w"></i>'
    },
    black: {
      starting: [".c0x3"],
      icon: '<i class="fas fa-chess-king b"></i>'
    }
  }
}

function startGame() {

  generateBoard()

  populateBoard()

  document.querySelector('.button').addEventListener('click', resetBoard)
}

//Puts the pieces on the board
function populateBoard() {

  for (let piece in pieces) {
    for (let i = 0; i < (pieces[piece].white.starting).length; i++) {
      document.querySelector(pieces[piece].white.starting[i]).innerHTML = pieces[piece].white.icon
      document.querySelector(pieces[piece].black.starting[i]).innerHTML = pieces[piece].black.icon
    }
  }
}

//Programmatically creates Chess Board
function generateBoard() {
  let board = {}
  board["cells"] = []

  for (let i = 0; i < 64; i++) {
    board.cells.push({})
    board.cells[i].row = Math.floor(i / 8)
    board.cells[i].col = i % 8

    if ((i + board.cells[i].row) % 2 == 0) {
      board.cells[i].color = "white";
    } else {
      board.cells[i].color = "black";
    }
  }
  const boardNode = document.getElementsByClassName('board')[0]
  board.cells.reduce(cellsToNodes, boardNode)
}

function cellsToNodes(boardNode, cell) {
  const node = document.createElement('div');
  node.classList.add('cell')
  node.classList.add(`c${cell.row}x${cell.col}`)

  cell.color == "white" ? node.classList.add('white') : node.classList.add('black')

  node.addEventListener('click', highlight)

  boardNode.appendChild(node)
  return boardNode;
}

//Highlight each square a piece could move to
function highlight(evt) {

  //ensures cell contains a piece
  if (!evt.target.classList.contains('fas')) {
    return;
  }

  // allow for toggling of the selected piece
  if (evt.target.parentNode.classList.contains('selected')) {
    removeHighlight(evt)
    return
  }

  removeHighlight(evt)

  //mark selected
  evt.target.parentNode.classList.add('selected')

  const possibleMoves = getMoves(evt.target)

  //if cell exists, highlight it
  possibleMoves.forEach(coord => {
    document.querySelector(coord).classList.add('highlight')
  })
}

function removeHighlight(evt) {
  if (document.querySelector('.selected')) {
    document.querySelector('.selected').classList.remove('selected')
  }

  const highlighted = document.querySelectorAll('.highlight')
  highlighted.forEach(x => x.classList.remove('highlight'))
}

//Return array of cells a piece can move to
function getMoves(target) {

  //Find row and col of selected
  const cell = target.parentNode.className.split(' ')[1].split('')
  const row = Number(cell[1])
  const col = Number(cell[3])

  //Find type and colour of piece
  const type = target.classList[1].split('-')[2]
  const colour = target.classList.contains('b') ? 'b' : 'w'

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

  let direction = colour == "w" ? -1 : 1 //find direction pawn needs to move in based on colour

  if (!document.querySelector(`.c${row+direction}x${col}`).children[0]) {
    arr.push(`.c${row+direction}x${col}`)
  }

  if ((colour == "w" && row == 6) || (colour == "b" && row == 1)) {
    if (!document.querySelector(`.c${row+direction*2}x${col}`).children[0]) {
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
      let childColour = document.querySelector(moves[move][index]).children[0].classList.contains('w') ? 'w' : 'b'
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

//Move capture piece to side box
function capturePiece() { //Need to pass in some details about the captured piece
  //get type and colour of piece
  const colour = ""

  const box = document.querySelector(`.box.${colour}`)
  const node = document.createElement('div')
  node.classList.add('sub-box')
  node.innerHTML = "" //replace with object reference

  box.appendChild(node)
}

function resetBoard() {

  let items = document.getElementsByClassName('fas')

  while (items.length > 0) {
    items[0].parentNode.removeChild(items[0])
  }

  populateBoard()
}