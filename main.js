document.addEventListener('DOMContentLoaded', startGame)

//Obj containing piece information
const pieces = {
  pawn: {
    white: {
      starting: [".c6x0", ".c6x1", ".c6x2", ".c6x3", ".c6x4", ".c6x5", ".c6x6", ".c6x7"],
      icon: "<i class='fas fa-chess-pawn w'</i>"
    },
    black: {
      starting: [".c1x0", ".c1x1", ".c5x2", ".c1x3", ".c1x4", ".c1x5", ".c1x6", ".c1x7"],
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

  turnManager('b')
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
  if (!evt.target.classList.contains('fas')) { //ensures cell contains a piece
    return;
  }

  let cell = evt.target.parentNode //stores selected cell on which highlights/possible moves is based
  if (cell.tagName === "i") {
    cell = evt.target.parentNode
  }

  if (cell.classList.contains('selected')) { // allow for toggling of the selected piece
    removeHighlight()
    return
  }

  removeHighlight()

  cell.classList.add('selected') //mark selected

  const possibleMoves = getMoves(evt.target)

  possibleMoves.forEach(coord => { //if cell exists, highlight it
    document.querySelector(coord).classList.add('highlight')
    document.querySelector(coord).addEventListener('click', movePiece)
  })
}

function movePiece(evt) {
  const originalCell = document.querySelector('.selected')

  const destinationCell = evt.target
  if (destinationCell.tagName === "I") {
    destinationCell = evt.target.parentNode
  }

  if (destinationCell.children[0]) {
    capturePiece(destinationCell)
  }

  const movingPiece = originalCell.removeChild(originalCell.children[0]) //remove the child on the (home)cell, place in destinationCell
  destinationCell.append(movingPiece)

  winCondition()

  removeHighlight()

  turnManager(getColour(movingPiece))
}

//Did you win?
function winCondition() {

  const whiteKing = document.querySelector('.fa-chess-king.w').parentNode
  const blackKing = document.querySelector('.fa-chess-king.b').parentNode

  const board = document.querySelector('.board')
  const whitePieces = [...board.querySelectorAll('.w')]
  const blackPieces = [...board.querySelectorAll('.b')]

  const whiteCheck = checkForCheck(whitePieces, blackKing)
  const blackCheck = checkForCheck(blackPieces, whiteKing)

  if (whiteCheck[0] == null && blackCheck[0] == null) {
    while (document.querySelector('.checked')) {
      document.querySelector('.checked').classList.remove('checked')
    }
  }

  if (whiteCheck[0] != null) {    //If black king is checked
    blackKing.classList.add('checked')
    whiteCheck.forEach(el => {
      el.parentNode.classList.add('checked')
    })
    checkForCheckMate(blackKing, blackPieces, whiteCheck)
  }

  if (blackCheck[0] != null) {    //If white king is checked
    whiteKing.classList.add('checked')
    whiteCheck.forEach(el => {
      el.parentNode.classList.add('checked')
    })
    checkForCheckMate(whiteKing, whitePieces, blackCheck)
  }
}

//Returns array of pieces that check the king
function checkForCheck(pieces, king) {
  const checking = []
  for (let i = 0; i < pieces.length; i++) {
    let moves = getMoves(pieces[i])
    if (moves.includes(`.${king.classList[1]}`)) {
      checking.push(pieces[i])
    }
  }

  return checking
}

function checkForCheckMate(king, allyPieces, enemyPieces) {
  const kingCell = king
  enemyCells = enemyPieces.map(el => el.parentNode.classList[1])




  
  const kingMoves = getMoves(kingCell.firstChild)

  

  console.log(enemyCells)

}

function removeHighlight() {
  if (document.querySelector('.selected')) {
    document.querySelector('.selected').classList.remove('selected')
  }

  const highlighted = document.querySelectorAll('.highlight')
  highlighted.forEach(function (el) {
    el.classList.remove('highlight')
    el.removeEventListener('click', movePiece)
  })
}

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

  let direction = colour == "w" ? -1 : 1 //find direction pawn needs to move in based on colour

  if (!document.querySelector(`.c${row+direction}x${col}`).children[0]) {
    arr.push(`.c${row+direction}x${col}`)
  }

  if ((colour == "w" && row == 6) || (colour == "b" && row == 1)) {
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

function turnManager(colour) {
  const newColour = colour == 'w' ? 'b' : 'w'

  //displays turn on UI
  const turnBox = document.querySelector('.turn')

  if (newColour == 'w') {
    turnBox.innerHTML = 'Turn: White'
  } else {
    turnBox.innerHTML = 'Turn: Black'
  }

  //Changes which pieces can be selected
  document.querySelectorAll('.non-interactive').forEach(el => {
    el.classList.remove('non-interactive');
  })

  document.querySelectorAll(`.${colour}`).forEach(el => {
    el.classList.add('non-interactive');
  })

}

function getColour(piece) {
  return colour = piece.classList.contains('w') ? 'w' : 'b'
}

//Move capture piece to side box
function capturePiece(cell) {

  const colour = cell.children[0].classList.contains('w') ? 'white' : 'black' //get type and colour of piece

  const box = document.querySelector(`.box.${colour}`)
  const node = document.createElement('div')
  const child = cell.children[0]

  node.classList.add('sub-box')

  node.appendChild(child)
  box.appendChild(node)
}

function resetBoard() {
  const boardItems = document.getElementsByClassName('fas')

  while (boardItems.length > 0) {
    boardItems[0].parentNode.removeChild(boardItems[0])
  }

  const boxItems = document.getElementsByClassName('sub-box')

  while (boxItems.length > 0) {
    boxItems[0].parentNode.removeChild(boxItems[0])
  }

  removeHighlight()

  while (document.querySelector('.checked')) {
    document.querySelector('.checked').classList.remove('checked')
  }

  populateBoard()

  turnManager('b')
}