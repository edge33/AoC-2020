const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  let memory = new Map();
  let spokenNumbers = input[0].split(",").map((n, i) => {
    // memory[+n] = { turn: i + 1, count: 1 };
    memory.set(+n, { turn: i + 1, count: 1 });
    return +n;
  });
  // console.log(spokenNumbers, memory);
  let turn = spokenNumbers.length + 1;
  while (turn <= 30000000) {
    let previousNumber = spokenNumbers[turn - 2];
    // console.log("checking:", previousNumber);
    const fromMemory = memory.get(previousNumber);
    if (fromMemory.count === 1) {
      spokenNumbers.push(0);
      // console.log(turn, 0)
      let tmpFromMemory = memory.get(0);
      if (tmpFromMemory) {
        tmpFromMemory.count++;
        memory.set(0, tmpFromMemory);
      } else {
        memory.set(0, {
          turn: turn,
          count: 1,
        });
      }
    } else if (fromMemory.count >= 1) {
      let newNumber = turn - 1 - fromMemory.turn;
      let newFromMemory = memory.get(newNumber);
      if (newFromMemory) {
        newFromMemory.count++;
        memory.set(newNumber, newFromMemory);
      } else {
        memory.set(newNumber, {
          turn: turn,
          count: 1,
        });
      }
      spokenNumbers.push(newNumber);
      // console.log(turn, newNumber)
    }
    let prevFromMemory = memory.get(previousNumber);
    prevFromMemory.turn = turn - 1;
    memory.set(previousNumber, prevFromMemory);

    turn++;
  }
  console.log(spokenNumbers[spokenNumbers.length - 1]);

  // for (let turn = spokenNumbers.length + 1; turn <= 30000000; turn++) {
  //   const lastNumber = spokenNumbers[turn - 2];
  //   let found = false;
  //   for (let i = turn - 3; i >= 0 && !found; i--) {
  //     if (spokenNumbers[i] === lastNumber) {
  //       let newNumber = turn - 2 - i;
  //       spokenNumbers.push(newNumber);
  //       // console.log("turn", turn, newNumber);
  //       found = true;
  //     }
  //   }
  //   if (!found) {
  //     spokenNumbers.push(0);
  //     // console.log("turn", turn, 0);
  //   }
  // }
  // console.log(spokenNumbers[spokenNumbers.length - 1]);
});

const findIndexReverse = (theArray, number) => {
  let clone = theArray.slice().reverse();
  return clone.findIndex((n) => n === number);
};
