let aiStatus = false

function toggleAI() {
  const aiButton = document.querySelector('#ai')

  if (aiButton.innerHTML === "AI: Disabled") {
    aiStatus = true;
    aiButton.innerHTML = "AI: Enabled"
    aiButton.classList.replace('black', 'white')
  } else {
    aiStatus = false;
    aiButton.innerHTML = "AI: Disabled"
    aiButton.classList.replace('white', 'black')
  }
}

function takeTurn() {
  let piece = ""
  let moves = []
  const king = document.querySelector('.fa-chess-king.black')
  if (king.parentNode.classList.contains('checked') && getMoves(king).length > 0) {
    piece = king
  } else {
    const board = document.querySelector('.board')
    const pieces = [...board.querySelectorAll('.fas.black')].filter(el => getMoves(el).length > 0)
    piece = pieces[getRandomNum(pieces.length)]
  }

  piece.parentNode.classList.add('selected')
  moves = getMoves(piece)

  setTimeout(function () {
    adjustMoveProbability(moves)
  }, 1000)
}

//If the selected piece can capture an enemy, increase the chances of it doing so
function adjustMoveProbability(moves) {
  const probableMoves = []
  for (let i = 0; i < moves.length; i++) {
    if (document.querySelector(moves[i]).children[0]) {
      const name = document.querySelector(moves[i]).children[0].classList[1].split('-')[2]

      let j = pieces[name].value
      while (j > 0) {
        probableMoves.push(moves[i])
        j--
      }

    } else {
      probableMoves.push(moves[i])
    }
  }

  movePiece(probableMoves[getRandomNum(probableMoves.length)])
}

function getRandomNum(num) {
  return Math.floor(Math.random() * num)
}