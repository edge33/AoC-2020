const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  const numbers = [];
  numbers.push(0);
  for (const line of input) {
    const newNumber = +line;
    let replaced = false;
    for (let i = 0; i < numbers.length && !replaced; i++) {
      if (newNumber < numbers[i]) {
        numbers.splice(i, 0, newNumber);
        replaced = true;
      }
    }
    if (!replaced) {
      numbers.push(newNumber);
    }
  }
  const answer1 = multiplyDifferences(numbers);
  console.log(answer1);
  const answer2 = countPaths(numbers);
  console.log(answer2);
});

const multiplyDifferences = (numbers) => {
  let diff1Counter = 0;
  let diff3Counter = 0;
  let lastNumber = 0;
  for (const currentNumber of numbers) {
    let diff = currentNumber - lastNumber;
    if (diff === 1) diff1Counter++;
    if (diff === 3) diff3Counter++;
    lastNumber = currentNumber;
  }
  diff3Counter++;
  return diff1Counter * diff3Counter;
};

countPaths = (numbers) => {
  const paths = new Array(numbers.length).fill(0);
  paths[0] = 1
  for (let i = 1; i < numbers.length; i++) {
    for (let j = 0; j < i; j++) {
      if (numbers[i] - numbers[j] <= 3) {
        paths[i] += paths[j]
      }
    }
  }
  return paths[paths.length - 1];
};

