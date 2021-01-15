const getInput = require('../../utils/getInput')
const path = require('path')

const ACTIVE = '#'
const INACTIVE = '.'

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let world = []
  let newWorld = []
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      let element = {
        x: j,
        y: i,
        z: 0,
        status: input[i][j],
      }
      world.push({ ...element })
      newWorld.push({ ...element })
    }
  }
  const answer1 = getAnswer1(world, newWorld)
  console.log(answer1)
})

const getAnswer1 = (world, newWorld) => {
  let state = world
  let newState = newWorld

  let cycleCounts = 6
  for (let cycle = 1; cycle <= cycleCounts; cycle++) {
    fillDimensions(state, newState)
    for (let i = 0; i < state.length; i++) {
      applyTransitionFunction(state, newState, i)
    }

    let tmp = state
    state = newState
    newState = tmp
  }

  const activeCount = state.reduce(
    (acc, curr) => (curr.status === ACTIVE ? acc + 1 : acc),
    0
  )
  return activeCount
}

const applyTransitionFunction = (state, newState, elementIndex) => {
  let maxX = state[elementIndex].x + 1
  let minX = state[elementIndex].x - 1
  let minY = state[elementIndex].y - 1
  let maxY = state[elementIndex].y + 1
  let minZ = state[elementIndex].z - 1
  let maxZ = state[elementIndex].z + 1
  let element = state[elementIndex]

  const activeNeighbors = state.filter(
    (e) =>
      e.x >= minX &&
      e.x <= maxX &&
      e.y >= minY &&
      e.y <= maxY &&
      e.z >= minZ &&
      e.z <= maxZ &&
      !(e.x === element.x && e.y === element.y && element.z === e.z) &&
      e.status === ACTIVE
  ).length

  switch (state[elementIndex].status) {
    case ACTIVE:
      if (activeNeighbors < 2 || activeNeighbors > 3) {
        newState[elementIndex].status = '.'
      } else {
        newState[elementIndex].status = state[elementIndex].status
      }
      break
    case INACTIVE:
      if (activeNeighbors === 3) {
        newState[elementIndex].status = '#'
      } else {
        newState[elementIndex].status = state[elementIndex].status
      }
      break
  }
}

const fillDimensions = (state, newState) => {
  let maxZ = Math.max(...state.map((e) => e.z))
  let minZ = Math.min(...state.map((e) => e.z))
  let maxX = Math.max(...state.map((e) => e.x))
  let minX = Math.min(...state.map((e) => e.x))
  let maxY = Math.max(...state.map((e) => e.y))
  let minY = Math.min(...state.map((e) => e.y))

  for (let z = minZ; z <= maxZ; z++) {
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let newZ = z - 1; newZ <= z + 1; newZ++) {
          for (let newX = x - 1; newX <= x + 1; newX++) {
            for (let newY = y - 1; newY <= y + 1; newY++) {
              if (
                state.filter(
                  (i) => i.x === newX && i.y === newY && i.z === newZ
                ).length === 0
              ) {
                state.push({ x: newX, y: newY, z: newZ, status: INACTIVE })
                newState.push({ x: newX, y: newY, z: newZ, status: INACTIVE })
              }
            }
          }
        }
      }
    }
  }
}

const printWorld = (state) => {
  let maxZ = Math.max(...state.map((e) => e.z))
  let minZ = Math.min(...state.map((e) => e.z))
  for (let z = minZ; z <= maxZ; z++) {
    console.log('z', z)
    printStateLayer(state, z)
  }
}

const printStateLayer = (state, layer) => {
  const layerItems = state.filter((i) => i.z === layer)
  if (layerItems.length === 0) return

  let maxY = Math.max(...state.map((e) => e.y))
  let minY = Math.min(...state.map((e) => e.y))

  for (let y = minY; y <= maxY; y++) {
    const line = state
      .filter((e) => e.z === layer && e.y === y)
      .sort((a, b) => a.x - b.x)
    console.log(
      line
        .map((e) => {
          return `${e.status} `
        })
        .join('')
    )
  }
  console.log('')
}
