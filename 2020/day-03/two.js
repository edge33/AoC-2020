const getInput = require("../../utils/getInput");
const path = require("path");

const treeChar = "#";

getInput(path.join(__dirname, "input.txt"), (input) => {
  const pathsToCheck = [
    { right: 1, down: 1 },
    { right: 3, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 },
  ];
  let product = 1;
  for (let singlePath of pathsToCheck) {
    product *= computePath(singlePath, input);
  }
  console.log(product);
});

computePath = (pathToCheck, input) => {
  const down = pathToCheck.down;
  let column = pathToCheck.right;
  let treeCount = 0;
  for (let row = down; row < input.length; row += down) {
    const chars = input[row].split("");
    if (chars[column] == treeChar) {
      treeCount++;
    }
    column = (column += pathToCheck.right) % chars.length;
  }
  return treeCount;
};
