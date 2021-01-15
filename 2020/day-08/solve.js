const getInput = require("../../utils/getInput");
const path = require("path");

const rootBagRegexp = new RegExp(/^\w+\s\w+/);
const childrenBagRegexp = new RegExp(/(\d)\s(\w+\s\w+)/, "g");

getInput(path.join(__dirname, "input.txt"), (input) => {
  const program = [];
  for (const line of input) {
    const [instruction, value] = line.split(" ");
    program.push({ instruction, value });
  }
  const answer1 = getValueBeforeLoop(program);
  const answer2 = doesProgramTerminate(program, 0, program);
  console.log(answer1);
  console.log(answer2);
  // buildNewProgram(program, 0);
});

const getValueBeforeLoop = (program) => {
  let accValue = 0;
  let instructionPointer = 0;
  const executedInstructions = [];
  while (instructionPointer < program.length) {
    const currentInstructionObj = program[instructionPointer];
    if (alreadyExecuted(executedInstructions, instructionPointer)) {
      return accValue;
    }

    executedInstructions.push(instructionPointer);

    switch (currentInstructionObj.instruction) {
      case "nop":
        instructionPointer++;
        break;
      case "acc":
        instructionPointer++;
        accValue += +currentInstructionObj.value;
        break;
      case "jmp":
        instructionPointer += +currentInstructionObj.value;
        break;
    }
  }
  return accValue;
};

const alreadyExecuted = (executedInstructions, currentInstructionPointer) => {
  const index = executedInstructions.findIndex(
    (instruction) => instruction === currentInstructionPointer
  );
  return index !== -1;
};

const doesProgramTerminate = (
  programToTest,
  lastInstructionChangedPointer,
  originalProgram
) => {
  let accValue = 0;
  const executedInstructions = [];
  let instructionPointer = 0;
  while (instructionPointer < programToTest.length) {
    const currentInstructionObj = programToTest[instructionPointer];
    if (alreadyExecuted(executedInstructions, instructionPointer)) {
      /**
       * LOOP DETECTED
       * BUILD NEW PROGRAM
       * RE-RUN
       */
      return doesProgramTerminate(
        buildNewProgram(originalProgram, lastInstructionChangedPointer),
        lastInstructionChangedPointer + 1,
        originalProgram
      );
    }
    executedInstructions.push(instructionPointer);
    switch (currentInstructionObj.instruction) {
      case "nop":
        instructionPointer++;
        break;
      case "acc":
        instructionPointer++;
        accValue += +currentInstructionObj.value;
        break;
      case "jmp":
        instructionPointer += +currentInstructionObj.value;
        break;
    }
  }
  return accValue;
};

const buildNewProgram = (originalProgram, lastInstructionChangedPointer) => {
  const newProgram = originalProgram.map(obj => {return {...obj}});
  let pointer = lastInstructionChangedPointer;
  let currentInstruction = newProgram[pointer].instruction;
  while (currentInstruction === "acc" && pointer < newProgram.length - 1) {
    currentInstruction = newProgram[++pointer].instruction;
  }
  if (currentInstruction === "nop") {
    currentInstruction = "jmp";
  } else if (currentInstruction === "jmp") {
    currentInstruction = "nop";
  }
  newProgram[pointer].instruction = currentInstruction;
  return newProgram;
};
