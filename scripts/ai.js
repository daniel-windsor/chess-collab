let aiStatus = false

function toggleAI(evt) {
  if (evt.target.innerHTML === "AI: Disabled") {
    aiStatus = true;
    evt.target.innerHTML = "AI: Enabled"
  } else {
    aiStatus = false;
    evt.target.innerHTML = "AI: Disabled"
  }
} 

function takeTurn() {
  saveKing()
  const board = document.querySelector('.board')
  const pieces = board.querySelectorAll('.b')
  const piece = pieces[getRandomNum(pieces.length)]
  const pieceMoves = getMoves(piece)

  if (pieceMoves.length == 0) {
    takeTurn()
  } else {
    piece.parentNode.classList.add('selected')
    let move = pieceMoves[getRandomNum(pieceMoves.length)]
    movePiece(move)
  }
}

function saveKing() {
  const king = document.querySelector('.fa-chess-king.b')
  console.log(king)
}

function getRandomNum(num) {
  return Math.floor(Math.random() * num)
}