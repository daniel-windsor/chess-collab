document.addEventListener('DOMContentLoaded', startGame)

function startGame() {
  console.log("started")

  //Instantiate click listeners

  generateBoard()
}

//Programmatically creates Chess Board
function generateBoard() {

  let board = {}
  board["cells"] = []

  for (let i = 0; i < 64; i++) {
    board.cells.push({})
    board.cells[i].row = i % 8
    board.cells[i].col = Math.floor(i / 8)

    if ((i + board.cells[i].col) % 2 == 0) {
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

  if (cell.color == "white") {
    node.classList.add('white')
  } else {
    node.classList.add('black')
  }

  boardNode.appendChild(node)
  return boardNode;
}