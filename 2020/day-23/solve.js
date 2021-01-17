const getInput = require('../../utils/getInput')
const path = require('path')

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let circle = input[0].split('').map((n) => +n)
  const answer1 = runGame(circle, 10)
})

const runGame = (circle, numberOfMoves) => {
  
}
