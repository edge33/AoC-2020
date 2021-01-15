const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  const numbers = [];
  let initialPaddingIndex = 0;
  let endPaddingIndex = 24;
  let indexToCheck = 25;
  for (const number of input) {
    numbers.push(+number);
  }
  const answer = findInvalidNumber(
    numbers,
    indexToCheck,
    initialPaddingIndex,
    endPaddingIndex
  );
  console.log(answer.number);
  const answer2 = getContiguousSetSum(numbers, answer.number, answer.index, 0);
  console.log(answer2)
});

const findInvalidNumber = (numbers, indexToCheck, start, end) => {
  let valid = checkNumber(numbers, indexToCheck, start, end);
  if (!valid) return { number: numbers[indexToCheck], index: indexToCheck };
  return findInvalidNumber(numbers, indexToCheck + 1, start + 1, end + 1);
};

const checkNumber = (numbers, indexToCheck, start, end) => {
  const numberToCheck = numbers[indexToCheck];
  for (let i = start; i <= end; i++) {
    const numberToFind = numberToCheck - numbers[i];
    for (let j = start; j < end; j++) {
      if ((i !== j && numbers[j]) === numberToFind) {
        return true;
      }
    }
  }
  return false;
};

const getContiguousSetSum = (
  numbers,
  numberToMatch,
  numberToMatchIndex,
  start
) => {
  const contiguousSet = findContiguousSet(
    numbers,
    numberToMatch,
    numberToMatchIndex,
    start
  );
  return Math.min(...contiguousSet) + Math.max(...contiguousSet);
};

const findContiguousSet = (
  numbers,
  numberToMatch,
  numberToMatchIndex,
  start
) => {
  const set = [];
  let sum = 0;
  let i = start;
  while (i <= numberToMatchIndex) {
    const currentNumber = numbers[i];
    set.push(currentNumber);
    sum += currentNumber;
    if (sum === numberToMatch) return set;
    else if (sum > numberToMatch) {
      return findContiguousSet(
        numbers,
        numberToMatch,
        numberToMatchIndex,
        start + 1
      );
    }
    i++;
  }
};
