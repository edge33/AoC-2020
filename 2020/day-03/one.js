const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  const treeChar = "#";
  let columnIndex = 3;
  let treeCount = 0;
  input = input.slice(1, input.length);
  for (line of input) {
    const chars = line.split("");
    if (chars[columnIndex] == treeChar) {
      treeCount++;
    }
    columnIndex = (columnIndex += 3) % chars.length;
  }
  console.log(treeCount);
});
