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
      [-7, -7],
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
  node.classList.add(`c${cell.row}x${cell.col}`)

  if (cell.color == "white") {
    node.classList.add('white')
  } else {
    node.classList.add('black')
  }

  node.addEventListener('click', highlight)

  boardNode.appendChild(node)
  return boardNode;
}

function highlight(evt) {

  //remove previous highlights
  const highlighted = document.querySelectorAll('.highlight')
  highlighted.forEach(x => x.classList.remove('highlight'))

  //highlight selected
  evt.target.classList.add('highlight')

  const type = "knight" //get piece in square

  //Find row and col of selected
  const cell = evt.target.className.split(' ')[1].split('')
  const row = Number(cell[1])
  const col = Number(cell[3])

  const moveSet = pieces[type].move
  let newCoordinates = []

  for (let i = 0; i < moveSet.length; i++) {
    //Find valid squares based on moveSet and current position
    newCoordinates.push(`.c${row + (moveSet[i][0] % 8)}x${col + moveSet[i][1]}`)
  }

  //If cell exists, highlight it
  newCoordinates.forEach(coord => {
    if (document.querySelector(coord))
      document.querySelector(coord).classList.add('highlight')
  })
}