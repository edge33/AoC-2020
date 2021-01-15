const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  for (let number of input) {
    number = +number;
    const toFind = 2020 - number;
    const indexOfItemToFound = input.findIndex((n) => +n === toFind);
    if (indexOfItemToFound !== -1) {
      return console.log(number * toFind);
    }
  }
});
