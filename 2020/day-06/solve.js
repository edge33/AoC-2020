const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  input.push("");
  const groups = [];
  let currentGroup = {
    people: 0,
    answers: {},
  };
  for (const line of input) {
    if (line === "") {
      groups.push(currentGroup);
      currentGroup = {
        people: 0,
        answers: {},
      };
    } else {
      const answers = line.split("");
      answers.map((answer) => {
        if (currentGroup.answers[answer]) {
          currentGroup.answers[answer]++;
        } else {
          currentGroup.answers[answer] = 1;
        }
      });
      currentGroup.people++;
    }
  }
  const answer1 = groups.reduce(
      (acc, cur) => acc + Object.keys(cur.answers).length,
      0
  );
  console.log(answer1);
  const answer2 = groups.reduce((acc, cur) => {
    const answers = Object.keys(cur.answers);
    let count = 0;
    for (const answer of answers) {
      if (cur.answers[answer] === cur.people) {
        count++;
      }
    }
    return acc + count;
  }, 0);
  console.log(answer2);
});
