document.addEventListener('DOMContentLoaded', startGame)

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