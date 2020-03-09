//Highlight each square a piece could move to
function highlight(evt) {
  if (!evt.target.classList.contains('fas')) { //ensures cell contains a piece
    return;
  }

  let cell = evt.target.parentNode //stores selected cell on which highlights/possible moves is based
  if (cell.tagName === "i") {
    cell = evt.target.parentNode
  }

  if (cell.classList.contains('selected')) { // allow for toggling of the selected piece
    removeHighlight()
    return
  }

  removeHighlight()

  cell.classList.add('selected') //mark selected

  const possibleMoves = getMoves(evt.target)

  possibleMoves.forEach(coord => { //if cell exists, highlight it
    document.querySelector(coord).classList.add('highlight')
    document.querySelector(coord).addEventListener('click', movePiece)
  })
}

function removeHighlight() {
  if (document.querySelector('.selected')) {
    document.querySelector('.selected').classList.remove('selected')
  }

  const highlighted = document.querySelectorAll('.highlight')
  highlighted.forEach(function (el) {
    el.classList.remove('highlight')
    el.removeEventListener('click', movePiece)
  })
}

//Move capture piece to side box
function capturePiece(cell) {

  const colour = cell.children[0].classList.contains('w') ? 'white' : 'black' //get type and colour of piece

  const box = document.querySelector(`.box.${colour}`)
  const node = document.createElement('div')
  const child = cell.children[0]

  node.classList.add('sub-box')

  node.appendChild(child)
  box.appendChild(node)
}

//promote pawn
function promoteMe(destinationCell) {
  const colour = getColour(destinationCell.firstChild)
  const colourLong = colour == 'w' ? 'white' : 'black'

  const cellCoord = destinationCell.className.split(' ')[1].split('')
  const row = Number(cellCoord[1])

  if (row == 0 || row == 7) {
    const pieces = document.querySelectorAll(`.${colourLong} .sub-box`)

    pieces.forEach(function (el) {
      el.classList.add('highlight')

      el.addEventListener('click', function (evt) {
        console.log(evt.target)
        capturePiece(destinationCell)
        evt.target.remove();
        destinationCell.appendChild(evt.target.children[0])

        removeHighlight()
      })
    })
  }
}

//Did you win?
function winCondition() {

  while (document.querySelector('.checked')) {
    document.querySelector('.checked').classList.remove('checked')
  }

  const whiteKing = document.querySelector('.fa-chess-king.w').parentNode
  const blackKing = document.querySelector('.fa-chess-king.b').parentNode

  const board = document.querySelector('.board')
  const whitePieces = [...board.querySelectorAll('.w')]
  const blackPieces = [...board.querySelectorAll('.b')]

  const whiteCheck = checkForCheck(whitePieces, blackKing)
  const blackCheck = checkForCheck(blackPieces, whiteKing)

  if (whiteCheck[0] != null) { //If black king is checked
    blackKing.classList.add('checked')
    whiteCheck.forEach(el => {
      el.parentNode.classList.add('checked')
    })
    showCheckModal()
    checkForCheckMate(blackKing, blackPieces, whiteCheck)
  }

  if (blackCheck[0] != null) { //If white king is checked
    whiteKing.classList.add('checked')
    whiteCheck.forEach(el => {
      el.parentNode.classList.add('checked')
    })
    showCheckModal()
    checkForCheckMate(whiteKing, whitePieces, blackCheck)
  }
}

//Returns array of pieces that check the king
function checkForCheck(pieces, king) {
  const checking = []
  for (let i = 0; i < pieces.length; i++) {
    let moves = getMoves(pieces[i])
    if (moves.includes(`.${king.classList[1]}`)) {
      checking.push(pieces[i])
    }
  }

  return checking
}

function checkForCheckMate(king, allyPieces, enemyPieces) {
  const kingCell = king
  enemyCells = enemyPieces.map(el => el.parentNode.classList[1])

  const kingMoves = getMoves(kingCell.firstChild)

  const enemyMoves = enemyPieces.map(el => getMoves(el))
  console.log(enemyMoves)

}

function getColour(piece) {
  return colour = piece.classList.contains('w') ? 'w' : 'b'
}