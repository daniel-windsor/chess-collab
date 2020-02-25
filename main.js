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
  rook: {
    move: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
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
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    whiteStarting: ["c7x2", "c7x5"],
    blackStarting: ["c0x2", "c0x5"]
  },
  queen: {
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

//Highlight each square a piece could move to
function highlight(evt) {

  //Ensures cell contains a piece
  if(!evt.target.classList.contains('fas')) {
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
    if (document.querySelector(coord))
      document.querySelector(coord).classList.add('highlight')
  })
}

//Return array of cells a piece can move to
function getMoves(target) {

  //Find row and col of selected
  const cell = target.parentNode.className.split(' ')[1].split('')
  const row = Number(cell[1])
  const col = Number(cell[3])

  //Find piece in cell
  const type = target.classList[1].split('-')[2]
  let colour = ""
  
  if (target.classList.contains('b')){
    colour = "b"
  } else {
    colour = "w"
  }

  const moveSet = pieces[type].move
  let possibleMoves = []

  for (let i = 0; i < moveSet.length; i++) {
    //Find valid squares based on moveSet and current position
    let coord = `.c${row + (moveSet[i][0] % 8)}x${col + moveSet[i][1]}`
    let children = document.querySelector(coord).children[0]

    if(children == null || !children.classList.contains(colour)) {
      possibleMoves.push(coord)
    }
  }

  return possibleMoves;
}