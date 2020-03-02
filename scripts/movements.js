//Handles pawn movement
function pawnMoves(row, col, colour) {
    let arr = []
  
    if (row == 0 || row == 7) { //Stops error when pawn reaches other side
      return arr
    }
  
    let direction = colour == "w" ? -1 : 1 //find direction pawn needs to move in based on colour
  
    if (!document.querySelector(`.c${row+direction}x${col}`).children[0]) {
      arr.push(`.c${row+direction}x${col}`)
    }
  
    if ((colour == "w" && row == 6) || (colour == "b" && row == 1)) {
      if (!document.querySelector(`.c${row+direction*2}x${col}`).children[0] && !document.querySelector(`.c${row+direction}x${col}`).children[0]) {
        arr.push(`.c${row+(direction*2)}x${col}`)
      }
    }
  
    //attacking
    let diag = [`.c${row+direction}x${col-1}`, `.c${row+direction}x${col+1}`] //get squares 1 row ahead and each side
  
    for (let i = 0; i < diag.length; i++) {
      if (document.querySelector(diag[i])) {
        let children = document.querySelector(diag[i]).children
        if (children[0] && !children[0].classList.contains(colour)) {
          arr.push(diag[i])
        }
      }
    }
  
  
    return arr
}
  
//Handles knight movement
function knightMoves(row, col, colour) {
    const moveSet = [
        [2, 1],
        [2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
        [-2, 1],
        [-2, -1]
    ]

    const moves = moveSet.map(el => `.c${row + (el[0] % 8)}x${col + el[1]}`)
        .filter(el => document.querySelector(el))
        .filter(el => !document.querySelector(el).children[0] || !document.querySelector(el).children[0].classList.contains(colour))

    return moves
}

//Handles king movement
function kingMoves(row, col, colour) {
    const moveSet = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ]

    const moves = moveSet.map(el => `.c${row + (el[0] % 8)}x${col + el[1]}`)
        .filter(el => document.querySelector(el))
        .filter(el => !document.querySelector(el).children[0] || !document.querySelector(el).children[0].classList.contains(colour))

    return moves
}

