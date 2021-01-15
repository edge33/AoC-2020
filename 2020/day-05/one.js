const getInput = require("../../utils/getInput");
const path = require("path");

const totalRows = 128;
const totalSeatsPerRow = 8;

getInput(path.join(__dirname, "input.txt"), (input) => {
  let max = 0;
  for (const boardingPass of input) {
   const newId = getPassId(boardingPass);
   if (newId > max) {
     max = newId;
   }
  }
  console.log(max);
});

const getPassId = (boardingPass) => {
  const letters = boardingPass.split("");
  return (
    partitionRow(letters.slice(0, 7), 0, 0, 127) * 8 +
    partitionSeat(letters.slice(7, 10), 0, 0, 7)
  );
};

const partitionRow = (letters, stepCount, start, end) => {
  if (stepCount === letters.length - 1) {
    if (letters[stepCount] === "F") {
      return start;
    }
    if (letters[stepCount] === "B") {
      return end;
    }
  }
  const partitionSize = Math.pow(2, stepCount + 1);
  if (letters[stepCount] === "F") {
    return partitionRow(
      letters,
      stepCount + 1,
      start,
      end - totalRows / partitionSize
    );
  }
  if (letters[stepCount] === "B") {
    return partitionRow(
      letters,
      stepCount + 1,
      start + totalRows / partitionSize,
      end
    );
  }
};

const partitionSeat = (letters, stepCount, start, end) => {
  if (stepCount === letters.length - 1) {
    if (letters[stepCount] === "L") {
      return start;
    }
    if (letters[stepCount] === "R") {
      return end;
    }
  }
  const partitionSize = Math.pow(2, stepCount + 1);
  if (letters[stepCount] === "L") {
    return partitionSeat(
        letters,
        stepCount + 1,
        start,
        end - totalSeatsPerRow / partitionSize
    );
  }
  if (letters[stepCount] === "R") {
    return partitionSeat(
        letters,
        stepCount + 1,
        start + totalSeatsPerRow / partitionSize,
        end
    );
  }
};
