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
  return (
    (password[min - 1] === letter && password[max - 1] !== letter) ||
    (password[min - 1] !== letter && password[max - 1] === letter)
  );
};
