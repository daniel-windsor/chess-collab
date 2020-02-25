document.addEventListener('DOMContentLoaded', startGame)

//Obj containing pieces and their move sets: [row, col]
const pieces = {
  pawn: {
    move: [
      [1, 0]
    ]
  },
  castle: {
    move: [
      [7, 0],
      [-7, 0],
      [0, 7],
      [0, -7]
    ]
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
    ]
  },
  bishop: {
    move: [
      [7, 7],
      [7, -7],
      [-7, 7],
      [-7, -7]
    ]
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
    ]
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
    ]
  }
}

function startGame() {

  console.log("started")

  generateBoard()
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

  node.addEventListener('click', onClick)

  boardNode.appendChild(node)
  return boardNode;
}

function onClick(evt) {

  //remove previous highlights
  let highlighted = document.querySelectorAll('.highlight')
  highlighted.forEach(x => x.classList.remove('highlight'))

  //highlight selected
  evt.target.classList.toggle('highlight')

  
  const type = "pawn" //get piece in square

  //Find row and col of selected
  let cell = evt.target.className.split(' ')[1]
  const row = cell.split('x')[0]
  const col = cell.split('x')[1]

  const moveSet = pieces[type].move

  console.log(moveSet)
}