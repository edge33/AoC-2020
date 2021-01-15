const getInput = require("../../utils/getInput");
const path = require("path");

const rootBagRegexp = new RegExp(/^\w+\s\w+/);
const childrenBagRegexp = new RegExp(/(\d)\s(\w+\s\w+)/, "g");

getInput(path.join(__dirname, "input.txt"), (input) => {
  const bagsList = {};
  for (const line of input) {
    const rootBag = rootBagRegexp.exec(line)[0];
    let theArray = [];
    const childrenBag = {};
    while ((theArray = childrenBagRegexp.exec(line)) !== null) {
      let [_, number, bag] = theArray;
      childrenBag[bag] = +number;
    }
    bagsList[rootBag] = childrenBag;
  }
  const answer1 = howManyBagsCanContain("shiny gold", bagsList);
  const answer2 = howManyBagsAreInside("shiny gold", bagsList);
  console.log(answer1, answer2);
});

const howManyBagsCanContain = (bagToLookFor, bagsList) => {
  let counter = 0;
  const bags = Object.keys(bagsList);
  for (const bag of bags) {
    if (bag !== bagToLookFor) {
      if (contains(bagToLookFor, bagsList[bag], bagsList)) {
        counter++;
      }
    }
  }
  return counter;
};

const contains = (bagToLookFor, bagsListToScan, bagsList) => {
  const childrenBags = Object.keys(bagsListToScan);
  if (childrenBags.length === 0) return false;
  const found = childrenBags.find((bag) => bag === bagToLookFor);
  if (found) return true;
  return childrenBags
    .map((bag) => contains(bagToLookFor, bagsList[bag], bagsList))
    .reduce((acc, cur) => {
      if (cur) return acc + 1;
      return acc;
    }, 0);
};

const howManyBagsAreInside = (bagToCheck, bagsList) => {
  const bagsInside = Object.keys(bagsList[bagToCheck]);
  if (bagsInside.length === 0) return 0;
  return bagsInside
    .map((bag) => {
      return (
        bagsList[bagToCheck][bag] +
        bagsList[bagToCheck][bag] * howManyBagsAreInside(bag, bagsList)
      );
    })
    .reduce((acc, curr) => acc + curr, 0);
};
