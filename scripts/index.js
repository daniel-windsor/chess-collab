document.addEventListener('DOMContentLoaded', startGame)

// Obj containing piece information
const pieces = {
  pawn: {
    white: {
      starting: [".c6x0", ".c6x1", ".c6x2", ".c6x3", ".c6x4", ".c6x5", ".c6x6", ".c6x7"],
      icon: '<i class="fas fa-chess-pawn w" draggable="true"</i>'
    },
    black: {
      starting: [".c1x0", ".c1x1", ".c1x2", ".c1x3", ".c1x4", ".c1x5", ".c1x6", ".c1x7"],
      icon: '<i class="fas fa-chess-pawn b"</i>'
    }
  },
  rook: {
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

  document.querySelector('#reset').addEventListener('click', resetBoard)
  document.querySelector('#hints').addEventListener('click', hints)

  turnManager('b')

  console.log(window)
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

  cell.color == "white" ? node.classList.add('white') : node.classList.add('black')

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
  const orientation = windowWidth > windowHeight ? 'horizontal' : 'vertical'

  if (orientation === "horizontal") {
    boardNode.style.width = windowHeight - 120 + 'px'
    boardNode.style.height = windowHeight - 120 + 'px'
  } else {
    boardNode.style.width = windowWidth - 80 + 'px'
    boardNode.style.height = windowWidth - 80 + 'px'
  }
}

function turnManager(colour) {
  const newColour = colour == 'w' ? 'b' : 'w'

  //displays turn on UI
  const turnBox = document.querySelector('.turn')

  if (newColour == 'w') {
    turnBox.innerHTML = 'Turn: White'
    turnBox.style.backgroundColor = 'var(--white-square)'
    turnBox.style.color = 'rgb(32, 45, 48)'
    turnBox.style.border = '2px solid rgb(32, 45, 48)'
  } else {
    turnBox.innerHTML = 'Turn: Black'
    turnBox.style.backgroundColor = 'var(--black-square)'
    turnBox.style.color = 'var(--text-color)'
    turnBox.style.border = '2px solid var(--text-color)'
  }

  //Changes which pieces can be selected
  document.querySelectorAll('.non-interactive').forEach(el => {
    el.classList.remove('non-interactive');
  })

  document.querySelectorAll(`.${colour}`).forEach(el => {
    el.classList.add('non-interactive');
  })
}

function hints(evt) {
  const cells = document.querySelectorAll('.cell')
  if (evt.target.innerHTML === "Hints: Enabled") {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.border = "3px solid #B4AE87"
    }
    evt.target.innerHTML = "Hints: Disabled"
  } else {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.border = ""
    }
    evt.target.innerHTML = "Hints: Enabled"
  }
}

function showCheckModal(colour) {
  if (colour == 'black') {
    const modal = document.querySelector('.modal-check')
    modal.style.display = "block"
    modal.style.backgroundColor = 'var(--black-square)'
    modal.style.color = 'var(--white-square)'
    modal.style.border = '3px solid var(--white-square)'
    setTimeout(disappear, 900)

    function disappear() {
      const modal = document.querySelector('.modal-check')
      modal.style.display = "none"
    }

  } else {
    const modal = document.querySelector('.modal-check')
    modal.style.display = "block"
    setTimeout(disappear, 900)

    function disappear() {
      const modal = document.querySelector('.modal-check')
      modal.style.display = "none"
    }
  }
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

  turnManager('b')
}