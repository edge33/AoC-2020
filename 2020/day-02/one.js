const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  let counter = 0;
  for (line of input) {
    if (validInput(...line.split(" "))) {
      counter++;
    }
  }
  console.log(counter);
});

validInput = (occurrences, letter, password) => {
  letter = letter.split(":")[0];
  const [min, max] = occurrences.split("-");
  const count = password.split("").filter(letterToCheck => letter === letterToCheck).length;
  return count >= min && count <= max;
};
