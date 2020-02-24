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
    board.cells[i].col = Math.floor(i/8)

    if(board.cells[i].row % 2 == 0) {
      board.cells[i].color = "black";
    } else {
      board.cells[i].color = "white";
    }
  }
    console.table(board.cells)
}