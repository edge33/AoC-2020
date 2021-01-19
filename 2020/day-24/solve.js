const getInput = require('../../utils/getInput')
const path = require('path')

const EAST = 'e'
const WEST = 'w'
const SOUTH_EAST = 'se'
const SOUTH_WEST = 'sw'
const NORTH_EAST = 'ne'
const NORTH_WEST = 'nw'

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let instructions = []
  for (let line of input) {
    let chars = line.split('')
    let cursor = 0
    let currentInstruction = []
    while (cursor < chars.length) {
      switch (chars[cursor]) {
        case 'e':
          currentInstruction.push('e')
          cursor++
          break
        case 'w':
          currentInstruction.push('w')
          cursor++
          break
        case 's':
          currentInstruction.push(`s${chars[cursor + 1]}`)
          cursor += 2
          break
        case 'n':
          currentInstruction.push(`n${chars[cursor + 1]}`)
          cursor += 2
          break
      }
    }
    instructions.push(currentInstruction)
  }
  let tilesMap = []
  let answer1 = countFlipped(instructions, tilesMap)
  console.log(answer1)
  let answer2 = simulateDays(tilesMap)
  console.log(answer2)
})

const countFlipped = (instructions, tilesMap) => {
  blackTilesCount = 0
  // tilesMap.push({ i: 0, j: 0, color: 'white' })
  for (let instruction of instructions) {
    let currentTile = { i: 0, j: 0 }
    for (let operation of instruction) {
      switch (operation) {
        case EAST:
          currentTile.j += 2
          break
        case WEST:
          currentTile.j -= 2
          break
        case SOUTH_WEST:
          currentTile.i += 1
          currentTile.j -= 1
          break
        case SOUTH_EAST:
          currentTile.i += 1
          currentTile.j += 1
          break
        case NORTH_WEST:
          currentTile.i -= 1
          currentTile.j -= 1
          break
        case NORTH_EAST:
          currentTile.i -= 1
          currentTile.j += 1
          break
      }
      let alreadyAdded = tilesMap.find((t) => t.i === currentTile.i && t.j === currentTile.j)
      if (!alreadyAdded) {
        tilesMap.push({ ...currentTile, color: 'white' })
      }
    }
    let tileInMap = tilesMap.find((t) => t.i === currentTile.i && t.j === currentTile.j)
    if (tileInMap.color === 'white') {
      tileInMap.color = 'black'
      blackTilesCount++
    } else {
      tileInMap.color = 'white'
      blackTilesCount--
    }
  }
  return blackTilesCount
}

const simulateDays = (tilesMap) => {
  let blackCount = tilesMap.filter((t) => t.color === 'black').length

  let state = tilesMap
  let newState = []
  for (let tile of tilesMap) {
    newState.push({ ...tile })
  }

  for (let i = 1; i <= 100; i++) {
    /**
     * fill boarder
     */
    let edgeTiles = state.filter((t) => t.color === 'black' && getAdjacents(state, t).length < 6)
    for (let edgeTile of edgeTiles) {
      //add adjacents
      //EAST
      let adjacent = { i: edgeTile.i, j: edgeTile.j + 2, color: 'white' }
      if (!state.find((t) => t.i === adjacent.i && t.j === adjacent.j)) {
        state.push(adjacent)
        newState.push({ ...adjacent })
      }
      //WEST
      adjacent = { i: edgeTile.i, j: edgeTile.j - 2, color: 'white' }
      if (!state.find((t) => t.i === adjacent.i && t.j === adjacent.j)) {
        state.push(adjacent)
        newState.push({ ...adjacent })
      }
      //SOUTH_WEST
      adjacent = { i: edgeTile.i + 1, j: edgeTile.j - 1, color: 'white' }
      if (!state.find((t) => t.i === adjacent.i && t.j === adjacent.j)) {
        state.push(adjacent)
        newState.push({ ...adjacent })
      }
      //SOUTH_EAST
      adjacent = { i: edgeTile.i + 1, j: edgeTile.j + 1, color: 'white' }
      if (!state.find((t) => t.i === adjacent.i && t.j === adjacent.j)) {
        state.push(adjacent)
        newState.push({ ...adjacent })
      }
      //NORTH_WEST
      adjacent = { i: edgeTile.i - 1, j: edgeTile.j - 1, color: 'white' }
      if (!state.find((t) => t.i === adjacent.i && t.j === adjacent.j)) {
        state.push(adjacent)
        newState.push({ ...adjacent })
      }
      //NORTH_EAST
      adjacent = { i: edgeTile.i - 1, j: edgeTile.j + 1, color: 'white' }
      if (!state.find((t) => t.i === adjacent.i && t.j === adjacent.j)) {
        state.push(adjacent)
        newState.push({ ...adjacent })
      }
    }

    for (let i = 0; i < state.length; i++) {
      let tile = state[i]
      let adjacentsBlack = getBlackAdjacents(state, tile)
      if (tile.color === 'black') {
        if (adjacentsBlack.length === 0 || adjacentsBlack.length > 2) {
          newState[i].color = 'white'
          blackCount--
        } else {
          newState[i].color = 'black'
        }
      } else {
        if (adjacentsBlack.length === 2) {
          blackCount++
          newState[i].color = 'black'
        } else {
          newState[i].color = 'white'
        }
      }
    }
    let tmp = state
    state = newState
    newState = tmp
  }
  return blackCount
}

const getBlackAdjacents = (tilesMap, tile) => {
  let adj = tilesMap
    .filter((t) => t.i !== tile.i || t.j !== tile.j)
    .filter((t) => Math.abs(t.i - tile.i) <= 1 && Math.abs(t.j - tile.j) <= 2 && t.color === 'black')
  return adj
}

const getAdjacents = (tilesMap, tile) => {
  let adj = tilesMap
    .filter((t) => t.i !== tile.i || t.j !== tile.j)
    .filter((t) => Math.abs(t.i - tile.i) <= 1 && Math.abs(t.j - tile.j) <= 2)
  return adj
}
