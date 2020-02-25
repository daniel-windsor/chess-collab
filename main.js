document.addEventListener('DOMContentLoaded', startGame)

//Obj containing pieces and their move sets: [row, col]
const pieces = {
  pawn: {
    move: [
      [1, 0]
    ],
    whiteStarting: ["c6x0", "c6x1", "c6x2", "c6x3", "c6x4", "c6x5", "c6x6", "c6x7"],
    blackStarting: ["c1x0", "c1x1", "c1x2", "c1x3", "c1x4", "c1x5", "c1x6", "c1x7"]
  },
  castle: {
    move: [
      [7, 0],
      [-7, 0],
      [0, 7],
      [0, -7]
    ],
    whiteStarting: ["c7x0", "c7x7"],
    blackStarting: ["c0x0", "c0x7"]
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
    whiteStarting: ["c7x1", "c7x6"],
    blackStarting: ["c0x1", "c0x6"]
  },
  bishop: {
    move: [
      [7, 7],
      [7, -7],
      [-7, 7],
      [-7, -7],
    ],
    whiteStarting: ["c7x2", "c7x5"],
    blackStarting: ["c0x2", "c0x5"]
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
    whiteStarting: ["c7x3"],
    blackStarting: ["c0x4"]
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
    whiteStarting: ["c7x4"],
    blackStarting: ["c0x3"]
  }
}

function startGame() {
  console.log("started")
  //Instantiate click listeners
  generateBoard()
  populateBoard()
}

function populateBoard() {

  //unless i can think of a way to refactor this function for it to be less verbose, we might have to split this function further --> function populatePawns, populateKings, etc.. idk what do you think?

  //read README.md for class naming system for pieces. i've just used classes for everything not ids.

  //populate black pawns
  let cellsBPawns = []; 
  for (let i = 0; i < 8; i++) {
    let cellBPawn = document.getElementsByClassName(`1x${i}`) //possible via querySelector? 
    cellsBPawns.push(cellBPawn)
  }

  for (let i = 0; i < 8; i++) {
    cellsBPawns[i][0].innerHTML = `<i class="fas fa-chess-pawn pb pb${i}"></i>`
  }

  //populate white pawns
  let cellsWPawns = []; 
  for (let i = 0; i < 8; i++) {
    let cellWPawn = document.getElementsByClassName(`6x${i}`) //possible via querySelector? 
    cellsWPawns.push(cellWPawn)
  }

  for (let i = 0; i < 8; i++) {
    cellsWPawns[i][0].innerHTML = `<i class="fas fa-chess-pawn pw pw${i}"></i>`
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
  node.classList.add(`${cell.row}x${cell.col}`)

  if (cell.color == "white") {
    node.classList.add('white')
  } else {
    node.classList.add('black')
  }

  boardNode.appendChild(node)
  return boardNode;
}