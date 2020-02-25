document.addEventListener('DOMContentLoaded', startGame)

//Obj containing pieces and their move sets: [row, col]
const pieces = {
  pawn: {
    move: [
      [1, 0]
    ],
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
      [7, 0],
      [-7, 0],
      [0, 7],
      [0, -7]
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
      [7, 7],
      [7, -7],
      [-7, 7],
      [-7, -7],
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
      [7, 0],
      [-7, 0],
      [0, 7],
      [0, -7],
      [7, 7],
      [7, -7],
      [-7, 7],
      [-7, -7]
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
  console.log("started")
  //Instantiate click listeners
  generateBoard()
  populateBoard()
}

function populateBoard() {

  for (let piece in pieces) {
    for (let i = 0; i < (pieces[piece].white.starting).length; i++) {
      document.querySelector(pieces[piece].white.starting[i]).innerHTML = pieces[piece].white.icon
    }
    for (let i = 0; i < (pieces[piece].black.starting).length; i++) {
      document.querySelector(pieces[piece].black.starting[i]).innerHTML = pieces[piece].black.icon
    }


  }



  // // white pawns
  // for (let i = 0; i < pieces.pawn.whiteStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.pawn.whiteStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-pawn w pw pw${i}"></i>`
  // };

  // // black pawns
  // for (let i = 0; i < pieces.pawn.blackStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.pawn.blackStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-pawn b pb pb${i}"></i>`
  // };

  // // white castles
  // for (let i = 0; i < pieces.castle.whiteStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.castle.whiteStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-rook w cw cw${i}"></i>`
  // };

  // // black castles
  // for (let i = 0; i < pieces.castle.blackStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.castle.blackStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-rook b cb cb${i}"></i>`
  // };

  // // white knights
  // for (let i = 0; i < pieces.knight.blackStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.knight.whiteStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-knight w nw nw${i}"></i>`
  // };

  // // black knights
  // for (let i = 0; i < pieces.knight.blackStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.knight.blackStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-knight b nb nb${i}"></i>`
  // };

  // // white bishops
  // for (let i = 0; i < pieces.bishop.whiteStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.bishop.whiteStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-bishop w bw bw${i}"></i>`
  // };

  // // black bishops
  // for (let i = 0; i < pieces.bishop.blackStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.bishop.blackStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-bishop b bb bb${i}"></i>`
  // };

  // // white queen
  // for (let i = 0; i < pieces.queen.whiteStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.queen.whiteStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-queen w qw"></i>`
  // };

  // // black queen
  // for (let i = 0; i < pieces.queen.blackStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.queen.blackStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-queen b qb"></i>`
  // };

  // // white king
  // for (let i = 0; i < pieces.king.whiteStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.king.whiteStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-king w kw"></i>`
  // };

  // // black king
  // for (let i = 0; i < pieces.king.blackStarting.length; i++) {
  //   let cell = document.querySelector(`.${pieces.king.blackStarting[i]}`);
  //   cell.innerHTML = `<i class="fas fa-chess-king b kb"></i>`
  // };

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

  if (cell.color == "white") {
    node.classList.add('white')
  } else {
    node.classList.add('black')
  }

  boardNode.appendChild(node)
  return boardNode;
}