const getInput = require('../../utils/getInput')
const path = require('path')

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let jigsaw = []
  let currentPiece = {}
  let matchesCache = {}
  for (let line of input) {
    if (line.includes('Tile')) {
      currentPiece = { id: line.match(/Tile (\S+):/)[1], data: [] }
    } else if (line === '') {
      jigsaw.push(buildJigsawPiece(currentPiece))
    } else {
      currentPiece.data.push(line)
    }
  }

  let edges = []
  let answer1 = 1
  for (let i = 0; i < jigsaw.length; i++) {
    matchesCache[jigsaw[i].id] = []
    let count = 0
    for (let j = 0; j < jigsaw.length; j++) {
      if (i === j) {
        continue
      }

      if (getMatch(jigsaw[i], jigsaw[j])) {
        matchesCache[jigsaw[i].id].push(jigsaw[j])
        count++
      }
    }
    if (count === 2) {
      edges.push(jigsaw[i])
      answer1 *= +jigsaw[i].id
    }
  }
  console.log(answer1)

  let board = new Array(Math.sqrt(jigsaw.length))
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(Math.sqrt(jigsaw.length))
  }
  let completeBoard = new Array(board.length * 8)
  for (let i = 0; i < completeBoard.length; i++) {
    completeBoard[i] = new Array(board.length * 8)
  }

  let piecesToPlace = jigsaw.map((p) => {
    return { ...p }
  })
  for (let transformation of edges[0].transformations) {
    let count = 0
    let matchesPositions = []
    for (let matchingTile of matchesCache[edges[0].id]) {
      for (let matchTransformation of matchingTile.transformations) {
        let match = checkMatch(transformation, matchTransformation)
        if (match) {
          matchesPositions.push({ match: match, tile: matchTransformation, piece: matchingTile })
          count++
          break
        }
      }
    }
    if (matchesPositions[0].match.position === 'R' && matchesPositions[1].match.position === 'B') {
      board[0][0] = { id: edges[0].id, tile: transformation.slice() }
      board[0][1] = { id: matchesPositions[0].piece.id, tile: matchesPositions[0].tile.slice() }
      board[1][0] = { id: matchesPositions[1].piece.id, tile: matchesPositions[1].tile.slice() }

      fillCompleteBoardWithTile(board[0][0].tile, completeBoard, 0, 0)
      fillCompleteBoardWithTile(board[0][1].tile, completeBoard, 0, 1)
      fillCompleteBoardWithTile(board[1][0].tile, completeBoard, 1, 0)

      piecesToPlace = piecesToPlace.filter(
        (p) => p.id !== matchesPositions[0].piece.id && p.id !== matchesPositions[1].piece.id && p.id !== edges[0].id
      )
      break
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 1; j < board.length; j++) {
      let tile = board[i][j]
      let matchingTiles = matchesCache[tile.id]
      for (let matchingTile of matchingTiles) {
        if (piecesToPlace.findIndex((piece) => piece.id === matchingTile.id) === -1) {
          continue
        }
        for (let transformation of matchingTile.transformations) {
          let match = checkMatch(tile.tile, transformation)
          if (match) {
            piecesToPlace = piecesToPlace.filter((p) => p.id !== matchingTile.id)
            switch (match.position) {
              case 'B':
                board[i + 1][j] = { tile: transformation, id: matchingTile.id }
                fillCompleteBoardWithTile(transformation, completeBoard, i + 1, j)
                break
              case 'L':
                board[i][j - 1] = { tile: transformation, id: matchingTile.id }
                fillCompleteBoardWithTile(transformation, completeBoard, i, j - 1)
                break
              case 'R':
                board[i][j + 1] = { tile: transformation, id: matchingTile.id }
                fillCompleteBoardWithTile(transformation, completeBoard, i, j + 1)
                break
              case 'T':
                board[i - 1][j] = { tile: transformation, id: matchingTile.id }
                fillCompleteBoardWithTile(transformation, completeBoard, i - 1, j)
                break
            }
          }
        }
      }
    }
  }

  let regexp1 = /(?=(.{18}(#).))/g
  let regexp2 = /(?=(#.{4}##.{4}##.{4}###))/
  let regexp3 = /(?=(.#..#..#..#..#..#...))/
  let smCount = 0

  let transformations = ['none', 'rotate', 'rotate', 'rotate', 'rotate', 'flip', 'rotate', 'rotate', 'rotate']
  let opsCount = 0
  for (let operation of transformations) {
    switch (operation) {
      case 'rotate':
        completeBoard = rotate(completeBoard)
        break
      case 'flip':
        completeBoard = flip(completeBoard)
        break
    }

    for (let i = 0; i < completeBoard.length - 2; i++) {
      // let match = regexp1.exec(completeBoard[0].join(''))
      let match = [...completeBoard[i].join('').matchAll(regexp1)]
      for (let sm of match) {
        // console.log('line', 1, 'check', completeBoard[i + 1].slice(sm.index, completeBoard[0].length).join(''))
        let secondMatch = completeBoard[i + 1]
          .slice(sm.index, sm.index + 20)
          .join('')
          .match(regexp2)
        if (secondMatch) {
          let thirdMatch = completeBoard[i + 2]
            .slice(secondMatch.index, completeBoard[0].length)
            .join('')
            .match(regexp3)
          if (thirdMatch) {
            smCount++
          }
        }
      }
    }
    opsCount++
    if (smCount === 0) {
      continue
    }
    let totalCount = 0
    for (let i = 0; i < completeBoard.length; i++) {
      for (let j = 0; j < completeBoard.length; j++) {
        if (completeBoard[i][j] === '#') {
          totalCount++
        }
      }
    }
    console.log(totalCount - smCount * 15)
    return
  }
})

const fillCompleteBoardWithTile = (tile, board, row, col) => {
  let tileI = 1
  let tileJ = 1
  for (let i = row * 8; i < row * 8 + 8; i++) {
    for (let j = col * 8; j < col * 8 + 8; j++) {
      board[i][j] = tile[tileI][tileJ]
      tileJ++
    }
    tileI++
    tileJ = 1
  }
}

const print = (matrix) => {
  for (let line of matrix) {
    console.log(line.join(''))
  }
  console.log()
}

const buildJigsawPiece = (piece) => {
  let baseMatrix = piece.data.map((line) => line.split(''))
  let transformations = [baseMatrix]
  let rotated = [...baseMatrix.map((line) => line)]
  for (let i = 0; i < 3; i++) {
    rotated = rotate(rotated)
    transformations.push(rotated)
  }
  let flipped = flip([...baseMatrix.map((line) => line)])
  transformations.push(flipped)
  rotated = [...flipped.map((line) => line)]
  for (let i = 0; i < 3; i++) {
    rotated = rotate(rotated)
    transformations.push(rotated)
  }

  return {
    id: piece.id,
    transformations,
  }
}

const getMatch = (a, b) => {
  for (let i = 0; i < a.transformations.length; i++) {
    for (let j = 0; j < b.transformations.length; j++) {
      let match = checkMatch(a.transformations[i], b.transformations[j])
      if (match) {
        return match
      }
    }
  }
  return undefined
}

const checkMatch = (a, b) => {
  //a top and b bottom
  if (a[0].join('') === b[b.length - 1].join('')) {
    return { position: 'T' }
  }

  //a right and b left
  let aRight = a.map((line) => line[a.length - 1]).join('')
  let bLeft = b.map((line) => line[0]).join('')
  if (aRight === bLeft) {
    return { position: 'R' }
  }

  //a bottom and b top
  if (a[a.length - 1].join('') === b[0].join('')) {
    return { position: 'B' }
  }

  //a left and b right
  let aLeft = a.map((line) => line[0]).join('')
  let bRight = b.map((line) => line[b.length - 1]).join('')
  if (aLeft === bRight) {
    return { position: 'L' }
  }
}

const flip = (matrix) => {
  return matrix.map((row) => row.slice().reverse())
}

const rotate = (matrix) => {
  const newMatrix = []
  const N = matrix.length - 1 // use a constant
  const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]))
  newMatrix.push(...result) // Spread operator
  return newMatrix
}
