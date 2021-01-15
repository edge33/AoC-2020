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
  return doCompute(line, start, end, 0, '+')
}

const doCompute = (line, index, end, sum, operation) => {
  if (index === end) {
    return sum
  }
  const char = line[index]
  switch (char) {
    case '+':
      return doCompute(line, index + 1, end, sum, '+')
    case '*':
      return doCompute(line, index + 1, end, sum, '*')
    case '(':
      let matchingEndParenthesesIndex = getMatchingParenthesesIndex(line, index)
      let subSum = doCompute(line, index + 1, matchingEndParenthesesIndex, 0, '+')
      sum = operation === '+' ? sum + subSum : sum * subSum
      return doCompute(line, matchingEndParenthesesIndex + 1, end, sum, operation)
    default:
      sum = operation === '+' ? sum + +char : sum * +char
      return doCompute(line, index + 1, end, sum, operation)
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
