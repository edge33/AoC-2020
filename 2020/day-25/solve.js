const getInput = require('../../utils/getInput')
const path = require('path')

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let cardPublicKey = input[0]
  let doorPublicKey = input[1]
  let subjectNumber = 7
  const cardLoop = computeLoopSize(+cardPublicKey, subjectNumber)
  const answer1 = transform(doorPublicKey, cardLoop)
  console.log(answer1);
})

const computeLoopSize = (key, subjectNumber) => {
  let result = 1
  let loopSize = 0
  while (result !== key) {
    loopSize++
    result = result * subjectNumber
    result = result % 20201227
  }
  return loopSize
}

const transform = (subjectNumber, loopSize) => {
  let result = 1
  for (let i = 0; i < loopSize; i++) {
    result = result * subjectNumber
    result = result % 20201227
  }
  return result
}
