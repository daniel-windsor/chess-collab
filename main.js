document.addEventListener('DOMContentLoaded', startGame)

//Obj containing pieces and their move sets: [row, col]
const pieces = {
  pawn: {
    move: [],
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
    move: [
      // [1, 0],
      // [-1, 0],
      // [0, 1],
      // [0, -1]
    ],
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
    move: [
      [2, 1],
      [2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
      [-2, 1],
      [-2, -1]
    ],
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
    move: [
      // [1, 1],
      // [1, -1],
      // [-1, 1],
      // [-1, -1],
    ],
    white: {
      starting: [".c7x2", ".c7x5"],
      icon: '<i class="fas fa-chess-bishop w"></i>'
    },
    black: {
      starting: [".c0x2", ".c0x5"],
      icon: '<i class="fas fa-chess-bishop b"></i>'
    }
  },
  queen: {
    move: [
      // [1, 0],
      // [-1, 0],
      // [0, 1],
      // [0, -1],
      // [1, 1],
      // [1, -1],
      // [-1, 1],
      // [-1, -1]
    ],
    white: {
      starting: [".c7x3"],
      icon: '<i class="fas fa-chess-queen w"></i>'
    },
    black: {
      starting: [".c0x4"],
      icon: '<i class="fas fa-chess-queen b"></i>'
    }
  },
  king: {
    move: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ],
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
}

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

  //Ensures cell contains a piece
  if (!evt.target.classList.contains('fas')) {
    return;
  }

  //remove previous highlights
  const highlighted = document.querySelectorAll('.highlight')
  highlighted.forEach(x => x.classList.remove('highlight'))

  //highlight selected
  evt.target.parentNode.classList.add('highlight')

  const possibleMoves = getMoves(evt.target)

  //If cell exists, highlight it
  possibleMoves.forEach(coord => {
    document.querySelector(coord).classList.add('highlight')
  })
}

//Return array of cells a piece can move to
function getMoves(target) {

  //Find row and col of selected
  const cell = target.parentNode.className.split(' ')[1].split('')
  const row = Number(cell[1])
  const col = Number(cell[3])

  //Find type and colour of piece
  const type = target.classList[1].split('-')[2]
  let colour = target.classList.contains('b') ? 'b' : 'w'

  const moveSet = pieces[type].move
  let possibleMoves = []

  switch (type) {
    case "pawn":
      possibleMoves.push(...pawnMoves(row, col, colour))
      break;
    case "rook":
      possibleMoves.push(...rookMoves(row, col, colour))
      break;
    case "bishop":
      possibleMoves.push(...bishopMoves(row, col, colour))
      break;
    case "queen":
      possibleMoves.push(...queenMoves(row, col, colour))
  }

  for (let i = 0; i < moveSet.length; i++) {
    //Find valid squares based on moveSet and current position
    let coord = `.c${row + (moveSet[i][0] % 8)}x${col + moveSet[i][1]}`

    if (document.querySelector(coord)) {
      let children = document.querySelector(coord).children[0]

      if (children == null || !children.classList.contains(colour)) {
        possibleMoves.push(coord)
      }
    }
  }
  return possibleMoves;
}

function pawnMoves(row, col, colour) {
  let arr = []

  let direction = colour == "w" ? -1 : 1 //find direction pawn needs to move in based on colour

  //default movement
  if (!document.querySelector(`.c${row+direction}x${col}`).children[0]) { //If square in front has no pieces
    arr.push(`.c${row+direction}x${col}`)

    //starting two squares
    if ((colour == "w" && row == 6) || (colour == "b" && row == 1)) {
      arr.push(`.c${row+(direction*2)}x${col}`)
    }
  }

  //attacking
  let diag = [`.c${row+direction}x${col-1}`, `.c${row+direction}x${col+1}`] //get sqaures 1 row ahead and each side

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

function rookMoves(row, col, colour) {
  return maxStraight(row, col, colour)
}

function bishopMoves(row, col, colour) {
  return maxDiagonal(row, col, colour)
}

function queenMoves(row, col, colour) {
  return [...maxStraight(row, col, colour), ...maxDiagonal(row, col, colour)]
}

function maxStraight(row, col, colour) {
  let arr = []

  //maxNorth
  for (let i = row - 1; i > -1; i--) {
    if (!document.querySelector(`.c${i}x${col}`).children[0]) {
      arr.push((`.c${i}x${col}`))
    } else {
      break;
    }
  }

  //maxSouth
  for (let i = row + 1; i < 8; i++) {
    if (!document.querySelector(`.c${i}x${col}`).children[0]) {
      arr.push((`.c${i}x${col}`))
    } else {
      break;
    }
  }

  //maxEast
  for (let i = col + 1; i < 8; i++) {
    if (!document.querySelector(`.c${row}x${i}`).children[0]) {
      arr.push((`.c${row}x${i}`))
    } else {
      break;
    }
  }

  //maxWest
  for (let i = col - 1; i > -1; i--) {
    if (!document.querySelector(`.c${row}x${i}`).children[0]) {
      arr.push((`.c${row}x${i}`))
    } else {
      break;
    }
  }

  console.log(arr)

  return arr;
}

function maxDiagonal(row, col, colour) {

  let arr = []

  //maxNorthEast
  for (let i = 1; i < 8; i++) {
    if (!document.querySelector(`.c${row-i}x${col+i}`).children[0]) {
      arr.push((`.c${row-i}x${col+i}`))
    } else {
      break;
    }
  }

  //maxSouthEast
  for (let i = 1; i < 8; i++) {
    if (!document.querySelector(`.c${row+i}x${col+i}`).children[0]) {
      arr.push((`.c${row+i}x${col+i}`))
    } else {
      break;
    }
  }

  //maxSouthWest
  for (let i = 1; i < 8; i++) {
    if (!document.querySelector(`.c${row+i}x${col-i}`).children[0]) {
      arr.push((`.c${row+i}x${col-i}`))
    } else {
      break;
    }
  }

  //maxNorthWest
  for (let i = 1; i < 8; i++) {
    if (!document.querySelector(`.c${row-i}x${col-i}`).children[0]) {
      arr.push((`.c${row-i}x${col-i}`))
    } else {
      break;
    }
  }

  return arr
}