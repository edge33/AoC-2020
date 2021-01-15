const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  const validators = [];
  let myTicket = [];
  const nearbyTickets = [];

  let index = 0;
  let matches = null;
  do {
    let line = input[index];
    matches = line.match(/(^.*): (\d+)-(\d+) or (\d+)-(\d+)$/);
    if (matches) {
      const [_, name, a, b, c, d] = matches;
      validators.push({
        name: name,
        rules: [
          [+a, +b],
          [+c, +d],
        ],
      });
    }
    index++;
  } while (matches);
  index++;
  myTicket = input[index].split(",").map((n) => +n);
  index += 3;
  let line = input[index];
  while (line) {
    nearbyTickets.push(line.split(",").map((n) => +n));
    line = input[++index];
  }
  let ticketsToRemove = [];
  const { sum, validTickets } = getTicketScanningErrorRate(
    validators,
    nearbyTickets,
    ticketsToRemove
  );
  console.log(sum);
  const answer2 = getDepartureFieldsProduct(validators, validTickets, myTicket);
  console.log(answer2);
});

const getTicketScanningErrorRate = (validators, tickets, ticketsToRemove) => {
  let sum = 0;
  let validTickets = [];
  let validatorRules = validators.reduce(
    (acc, curr) => acc.concat(curr.rules),
    []
  );
  for (const ticket of tickets) {
    let validTicket = true;
    for (const number of ticket) {
      let valid = false;
      for (let i = 0; i < validatorRules.length && !valid; i++) {
        const validator = validatorRules[i];
        const [min, max] = validator;
        if (number >= min && number <= max) {
          valid = true;
        }
      }
      if (!valid) {
        validTicket = false;
        sum += number;
      }
    }
    if (validTicket) {
      validTickets.push(ticket);
    }
  }
  return { sum, validTickets };
};

const getDepartureFieldsProduct = (validators, validTickets, myTicket) => {
  let solution = new Array(myTicket.length);
  /**
   * build list of a possible validation for each column
   */
  let validCombinations = new Array(myTicket.length);
  for (let i = 0; i < myTicket.length; i++) {
    validCombinations[i] = validators.map((v) => v.name);
  }
  // console.log(validCombinations);

  /**
   * transpose the tickets
   * for each transposed ticket i
   *  check if number is not valid according some validator
   *    in case remove the validator for the corresponding i
   *  if the column i has only one validator
   *    remove this validator from all others set
   *    repeat the step if there are some more unique validators
   */

  // transpose
  const transposed = [];
  for (let i = 0; i < validTickets[0].length; i++) {
    let transposedTicket = [];
    for (let validTicket of validTickets) {
      transposedTicket.push(validTicket[i]);
    }
    transposed.push(transposedTicket);
  }
  // console.log(transposed);

  for (let i = 0; i < transposed.length; i++) {
    const transposedTicket = transposed[i];
    for (let j = 0; j < transposedTicket.length; j++) {
      const columnElement = transposedTicket[j];
      //check if number has some faulty validator

      let valid = true;
      for (let k = 0; k < validators.length; k++) {
        const currentValidator = validators[k];
        valid = false;
        for (let rule of currentValidator.rules) {
          let [min, max] = rule;
          if (columnElement >= min && columnElement <= max) {
            valid = true;
            break;
          }
        }

        if (!valid) {
          let nameToRemove = currentValidator.name;
          validCombinations[i] = validCombinations[i].filter(
            (c) => c !== nameToRemove
          );
          if (validCombinations[i].length === 1) {
            let singleCombinationName = validCombinations[i][0];
            let newSingleSolutionFound = false;
            let singleSolutionsCount = 0;
            do {
              singleSolutionsCount = 0;
              newSingleSolutionFound = false;
              let nextNameToFind = "";
              for (let vc = 0; vc < validCombinations.length; vc++) {
                if (validCombinations[vc].length > 1) {
                  if (
                    validCombinations[vc].findIndex(
                      (v) => v === singleCombinationName
                    ) !== -1
                  ) {
                    validCombinations[vc] = validCombinations[vc].filter(
                      (v) => v !== singleCombinationName
                    );
                    if (validCombinations[vc].length === 1) {
                      newSingleSolutionFound = true;
                      nextNameToFind = validCombinations[vc][0];
                    }
                  }
                } else {
                  singleSolutionsCount++;
                }
              }
              if (newSingleSolutionFound) {
                singleCombinationName = nextNameToFind;
              }
            } while (newSingleSolutionFound);
            if (singleSolutionsCount === myTicket.length) {
              let product = 1;
              validCombinations.map((c, i) => {
                if (c[0].includes("departure")) {
                  product *= myTicket[i];
                }
              });
              return product;
            }
          }
        }
        // console.log("right", min, max);
      }
    }
  }
};
