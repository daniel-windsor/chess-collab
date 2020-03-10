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
  let piece = ""
  let moves = []
  const king = document.querySelector('.fa-chess-king.b')
  if (king.parentNode.classList.contains('checked') && getMoves(king).length > 0) {
    piece = king
  } else {
    const board = document.querySelector('.board')
    const pieces = [...board.querySelectorAll('.b')].filter(el => getMoves(el).length > 0)
    piece = pieces[getRandomNum(pieces.length)]
  }

  piece.parentNode.classList.add('selected')
  moves = getMoves(piece)

  setTimeout(function () {
    adjustMoveProbability(moves)}
    , 1000)
}

//If the selected piece can capture an enemy, increase the chances of it doing so
function adjustMoveProbability(moves) {
  const probableMoves = []
  for (let i = 0; i < moves.length; i++) {
    if (document.querySelector(moves[i]).children[0]) {
      probableMoves.push(moves[i], moves[i], moves[i])
    } else {
      probableMoves.push(moves[i])
    }
  }
  console.log(probableMoves)
  movePiece(probableMoves[getRandomNum(probableMoves.length)])
}

function getRandomNum(num) {
  return Math.floor(Math.random() * num)
}