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
  let aiPiece = ""
  const king = document.querySelector('.fa-chess-king.black')
  if (king.parentNode.classList.contains('checked') && getMoves(king).length > 0) {
    aiPiece = king
  } else {
    const aiPieces = adjustPieceProbability()
    aiPiece = aiPieces[getRandomNum(aiPieces.length)]
  }

  aiPiece.parentNode.classList.add('selected')
  const moves = getMoves(aiPiece)

  setTimeout(function () {
    adjustMoveProbability(moves)
  }, 1000)
}

//Increase chance of selecting piece in danger of being captured
function adjustPieceProbability() {
  const board = document.querySelector('.board')
  const aiPieces = [...board.querySelectorAll('.fas.black')].filter(el => getMoves(el).length > 0)

  const enemyPieces = [...board.querySelectorAll('.fas.white')]
  const enemyMoves = enemyPieces.map(el => getMoves(el)).flat()

  const probablePieces = []

  aiPieces.forEach(function (el) {
    if (enemyMoves.includes(`.${el.parentNode.classList[1]}`)) {
      const name = el.classList[1].split('-')[2]
      let i = pieces[name].value
      while (i > 0) {
        probablePieces.push(el)
        i--
      }
    } else {
      probablePieces.push(el)
    }
  })

  return probablePieces
}

//Increase chance of capturing enemy piece when able
function adjustMoveProbability(moves) {
  const probableMoves = []
  moves.forEach(function (el) {
    if (document.querySelector(el).children[0]) {
      const name = document.querySelector(el).children[0].classList[1].split('-')[2]
      let j = pieces[name].value
      while (j > 0) {
        probableMoves.push(el)
        j--
      }
    } else {
      probableMoves.push(el)
    }
  })

  movePiece(probableMoves[getRandomNum(probableMoves.length)])
}

function getRandomNum(num) {
  return Math.floor(Math.random() * num)
}

function getName(obj) {
  return obj.children[0].classList[1].split('-')[2]
}