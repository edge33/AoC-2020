const getInput = require("../../utils/getInput");
const path = require("path");

const totalRows = 128;
const totalSeatsPerRow = 8;

const seatsMatrix = new Array(128);
for (let i = 0; i < seatsMatrix.length; i++) {
  seatsMatrix[i] = new Array(8);
  for (let j = 0; j < seatsMatrix[i].length; j++) {
    seatsMatrix[i][j] = "_";
  }
}

getInput(path.join(__dirname, "input.txt"), (input) => {
  for (const boardingPass of input) {
    const { row, seat } = getRowAndSeat(boardingPass);
    seatsMatrix[row][seat] = "X";
  }
  for (let i = 0; i < seatsMatrix.length; i++) {
    let rowString = seatsMatrix[i].map((char) => `[${char}]`).join();
    console.log(i, rowString);
  }
});

const getRowAndSeat = (boardingPass) => {
  const letters = boardingPass.split("");
  return {
    row: partitionRow(letters.slice(0, 7), 0, 0, 127),
    seat: partitionSeat(letters.slice(7, 10), 0, 0, 7),
  };
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
