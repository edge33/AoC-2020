const getInput = require('../../utils/getInput')
const path = require('path')

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let sum = 0
  for (const line of input) {
    const currentLine = line.match(/(\S)/gm)
    sum += compute(currentLine, 0, currentLine.length)
  }
  console.log(sum)
})

const compute = (line, start, end) => {
  let partialSums = []
  return doCompute(line, start, end, 0, '+', partialSums)
}

const doCompute = (line, index, end, sum, operation, partialSums) => {
  if (index === end) {
    partialSums.push(sum)
    return partialSums.reduce((acc, curr) => acc * curr, 1)
  }
  const char = line[index]
  switch (char) {
    case '+':
      return doCompute(line, index + 1, end, sum, '+', partialSums)
    case '*':
      partialSums.push(sum)
      return doCompute(line, index + 1, end, 0, '+', partialSums)
    case '(':
      let matchingEndParenthesesIndex = getMatchingParenthesesIndex(line, index)
      let subSum = doCompute(line, index + 1, matchingEndParenthesesIndex, 0, '+', [])
      sum = sum + subSum
      return doCompute(line, matchingEndParenthesesIndex + 1, end, sum, operation, partialSums)
    default:
      sum = sum + +char
      return doCompute(line, index + 1, end, sum, operation, partialSums)
  }
}

const getMatchingParenthesesIndex = (line, start) => {
  let count = 1
  for (let i = start + 1; i < line.length; i++) {
    switch (line[i]) {
      case '(':
        count++
        break
      case ')':
        count--
        break
    }
    if (count === 0) return i
  }
}
