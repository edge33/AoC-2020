const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  let departingTime = +input[0];
  let lines = input[1].match(/\d+/g).map((n) => +n);

  // const answer1 = getAnswer(departingTime, lines);
  let linesAndRemainders = [];
  let splitLines = input[1].split(",");
  for (let i = 0; i < splitLines.length; i++) {
    if (splitLines[i] !== "x") {
      linesAndRemainders.push({ mod: +splitLines[i], result: +i });
    }
  }
  // const answer2 = solveCRT(
  //   linesAndRemainders.map((item, i) =>
  //     i == 0 ? BigInt(0) : BigInt(linesAndRemainders[i].mod - +item.result)
  //   ),
  //   linesAndRemainders.map((item) => BigInt(+item.mod))
  // );
  const answer2 = getAnswer2(linesAndRemainders);
  // console.log(answer1);
  console.log(answer2);
});

getAnswer = (departingTime, lines) => {
  let lineToCatch = -1;
  let minimum = -1;
  for (let line of lines) {
    let timeCount = 0;
    while (true) {
      timeCount += line;
      if (timeCount >= departingTime) {
        if (timeCount < minimum || minimum === -1) {
          lineToCatch = line;
          minimum = timeCount;
        }
        break;
      }
    }
  }
  return lineToCatch * (minimum - departingTime);
};

const getAnswer2 = (linesAndRemainders) => {
  let result = +linesAndRemainders[0].mod - +linesAndRemainders[0].result;
  let step = +linesAndRemainders[0].mod;
  let index = 1;
  while (index < linesAndRemainders.length) {
    let item = linesAndRemainders[index];
    if ((result + item.result) % +item.mod === 0) {
      step *= +item.mod;
      index++;
    } else {
      result += step;
    }
  }
  return result;
};

const checkResult = (number, linesAndRemainders) => {
  for (let item of linesAndRemainders) {
    if (Math.abs((number % +item.mod) - item.mod) % item.mod !== item.result)
      return false;
  }
  return true;
};

const solveCRT = (remainders, modules) => {
  // Multiply all the modulus
  const prod = modules.reduce((acc, val) => acc * val, 1n);

  return (
    modules.reduce((sum, mod, index) => {
      // Find the modular multiplicative inverse and calculate the sum
      // SUM( remainder * productOfAllModulus/modulus * MMI ) (mod productOfAllModulus)
      const p = prod / mod;
      return sum + remainders[index] * modularMultiplicativeInverse(p, mod) * p;
    }, 0n) % prod
  );
};

const modularMultiplicativeInverse = (a, modulus) => {
  // Calculate current value of a mod modulus
  const b = BigInt(a % modulus);

  // We brute force the search for the smaller hipothesis, as we know that the number must exist between the current given modulus and 1
  for (let hipothesis = 1n; hipothesis <= modulus; hipothesis++) {
    if ((b * hipothesis) % modulus == 1n) return hipothesis;
  }
  // If we do not find it, we return 1
  return 1n;
};
