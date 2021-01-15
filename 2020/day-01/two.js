const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  for (let i = 0; i < input.length; i++) {
    const firstNumber = +input[i];
    for (let j = 0; j < input.length && i !== j; j++) {
      const secondNumber = +input[j];
      const toFind = 2020 - firstNumber - secondNumber;
      const indexOfItemToFound = input.findIndex((n) => +n === toFind);
      if (indexOfItemToFound !== -1) {
        return console.log(firstNumber * secondNumber * toFind);
      }
    }
  }
});