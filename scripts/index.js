document.addEventListener('DOMContentLoaded', startGame)

// Obj containing piece information
const pieces = {
  pawn: {
    white: {
      starting: [".c6x0", ".c6x1", ".c6x2", ".c6x3", ".c6x4", ".c6x5", ".c6x6", ".c6x7"],
      icon: '<i class="fas fa-chess-pawn white"</i>'
    },
    black: {
      starting: [".c1x0", ".c1x1", ".c1x2", ".c1x3", ".c1x4", ".c1x5", ".c1x6", ".c1x7"],
      icon: '<i class="fas fa-chess-pawn black"</i>'
    },
    value: 2
  },
  rook: {
    white: {
      starting: [".c7x0", ".c7x7"],
      icon: '<i class="fas fa-chess-rook white"></i>'
    },
    black: {
      starting: [".c0x0", ".c0x7"],
      icon: '<i class="fas fa-chess-rook black"></i>'
    },
    value: 6
  },
  knight: {
    white: {
      starting: [".c7x1", ".c7x6"],
      icon: '<i class="fas fa-chess-knight white"></i>'
    },
    black: {
      starting: [".c0x1", ".c0x6"],
      icon: '<i class="fas fa-chess-knight black"></i>'
    },
    value: 4
  },
  bishop: {
    white: {
      starting: [".c7x2", ".c7x5"],
      icon: '<i class="fas fa-chess-bishop white"></i>'
    },
    black: {
      starting: [".c0x2", ".c0x5"],
      icon: '<i class="fas fa-chess-bishop black"></i>'
    },
    value: 4
  },
  queen: {
    white: {
      starting: [".c7x3"],
      icon: '<i class="fas fa-chess-queen white"></i>'
    },
    black: {
      starting: [".c0x3"],
      icon: '<i class="fas fa-chess-queen black"></i>'
    },
    value: 10
  },
  king: {
    white: {
      starting: [".c7x4"],
      icon: '<i class="fas fa-chess-king white"></i>'
    },
    black: {
      starting: [".c0x4"],
      icon: '<i class="fas fa-chess-king black"></i>'
    },
    value: 20
  }
}

function startGame() {
  generateBoard()

  populateBoard()

  document.querySelector('#reset').addEventListener('click', resetBoard)
  document.querySelector('#hints').addEventListener('click', toggleHints)
  document.querySelector('#ai').addEventListener('click', toggleAI)

  turnManager('black')
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

  setBoardSize(boardNode)

  board.cells.reduce(cellsToNodes, boardNode)
}

function cellsToNodes(boardNode, cell) {
  const node = document.createElement('div');
  node.classList.add('cell')
  node.classList.add(`c${cell.row}x${cell.col}`)

  if (cell.color === "white") {
    node.classList.add('white')
  } else {
    node.classList.add('black')
  }

  node.addEventListener('click', highlight)

  const str = boardNode.style.width
  const boardSize = Number(str.substring(0, str.length - 2))

  node.style.width = `${(boardSize - 20) / 8}px`
  node.style.height = `${(boardSize - 20) / 8}px`
  node.style.fontSize = `${(boardSize - 20) / 8 - 20}px`

  boardNode.appendChild(node)
  return boardNode;
}

//Sizes board to suit window size
function setBoardSize(boardNode) {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  if (windowWidth > windowHeight) {
    boardNode.style.width = windowHeight - 120 + 'px'
    boardNode.style.height = windowHeight - 120 + 'px'
  } else {
    boardNode.style.width = windowWidth - 80 + 'px'
    boardNode.style.height = windowWidth - 80 + 'px'
  }
}

function turnManager(colour) {
  const newColour = getEnemyColour(colour)

  //displays turn on UI
  const turnBox = document.querySelector('.turn')

  if (newColour == 'white') {
    turnBox.innerHTML = 'Turn: White'
    turnBox.classList.replace('black', 'white')
  } else {
    turnBox.innerHTML = 'Turn: Black'
    turnBox.classList.replace('white', 'black')
  }

  //Changes which pieces can be selected
  document.querySelectorAll('.non-interactive').forEach(el => {
    el.classList.remove('non-interactive');
  })

  document.querySelectorAll(`.fas.${colour}`).forEach(el => {
    el.classList.add('non-interactive');
  })

  if (aiStatus && newColour === 'black') {
    setTimeout(takeTurn, 1000)
  }
}

function toggleHints(evt) {
  const cells = document.querySelectorAll('.cell')
  if (evt.target.innerHTML === "Hints: Enabled") {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.border = "3px solid var(--text-color)"
    }
    evt.target.innerHTML = "Hints: Disabled"
    evt.target.classList.replace('white', 'black')
  } else {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.border = ""
    }
    evt.target.innerHTML = "Hints: Enabled"
    evt.target.classList.replace('black', 'white')
  }
}

function showCheckModal(colour, message, timeout) {
  const modal = document.querySelector('.modal-check')

  if (colour == 'white') {
    modal.classList.replace('black', 'white')
  } else {
    modal.classList.replace('white', 'black')
  }
  modal.innerHTML = message
  modal.style.display = "block"
  setTimeout(hideCheckModal, timeout)
}

function hideCheckModal() {
  const modal = document.querySelector('.modal-check')
  modal.style.display = "none"
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

  turnManager('black')
}