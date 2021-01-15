const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
  let currentProgram = { mask: "", mem: [] };
  let programs = [];
  currentProgram["mask"] = input[0].match(/mask = (\S+)/)[1];
  input.splice(0, 1);
  input.push("");
  for (const line of input) {
    const matches = line.match(/mask = (\S+)/);
    if (line === "") {
      programs.push(currentProgram);
      break;
    }
    if (matches) {
      programs.push(currentProgram);
      currentProgram = { mask: "", mem: [] };
      let mask = matches[1];
      currentProgram.mask = mask;
    } else if (currentProgram) {
      let memoryConfig = line.match(/mem\[(\d+)\] = (\d+)/);
      currentProgram.mem.push(`${memoryConfig[1]}-${memoryConfig[2]}`);
    }
  }
  const answer = execute(programs);
  const answer2 = memoryDecoder(programs);
  console.log(answer, answer2);
});

const execute = (programs) => {
  const memoryState = {};
  for (const currentProgram of programs) {
    const mask = currentProgram.mask.split("");
    for (const currentInstruction of currentProgram.mem) {
      const [memory, value] = currentInstruction.split("-");
      const binaryValue = toFilledBinary(value, 36);
      // console.log(binaryValue.join(""));
      let result = new Array(36);
      for (let i = 0; i < result.length; i++) {
        if (mask[i] === "X") {
          result[i] = binaryValue[i];
        } else if (mask[i] === "0") {
          result[i] = "0";
        } else if (mask[i] === "1") {
          result[i] = "1";
        }
      }
      memoryState[memory] = result;
    }
  }
  let sum = 0;
  for (const state in memoryState) {
    sum += toDecimal(memoryState[state].join(""));
  }
  return sum;
};

const memoryDecoder = (programs) => {
  const memoryState = {};
  for (const currentProgram of programs) {
    const mask = currentProgram.mask.split("");
    for (const currentInstruction of currentProgram.mem) {
      const [memory, value] = currentInstruction.split("-");
      const memoryBinary = toFilledBinary(memory, 36);
      let memoryConfigDefinition = new Array(36);
      /**
       * APPLY MASK
       */
      let bitsCount = 0;
      for (let i = 0; i < memoryConfigDefinition.length; i++) {
        const item = mask[i];
        switch (item) {
          case "X":
            bitsCount++;
            memoryConfigDefinition[i] = "X";
            break;
          case "1":
            memoryConfigDefinition[i] = 1;
            break;
          case "0":
            memoryConfigDefinition[i] = memoryBinary[i];
            break;
        }
      }
      /**
       * BUILD CONFIGURATIONS COUNT FOR EVERY COMBINATION
       * AND CONFIGURATIONS BIT MASK
       * LET SAY 3 POSSIBLE CONFIGURATIONS -> ALL BINARIES FROM O TO 7
       */
      const combinationsToBuild = [];

      let configurationsCount = Math.pow(2, bitsCount);
      for (let i = 0; i < configurationsCount; i++) {
        combinationsToBuild.push(toFilledBinary(i, bitsCount));
      }

      /**
       * TEMPLATE FOR ALL POSSIBLE CONFIGURATIONS
       */
      let actualConfigurations = [];
      for (let i = 0; i < configurationsCount; i++)
        actualConfigurations.push(memoryConfigDefinition.slice());

      /**
       * REPLACE ALL POSSIBLE CONFIGURATION WITH THE ACTUAL CONFIGURATION
       */
      let indexOfConfigToEdit = 0;
      for (const currentCombination of combinationsToBuild) {
        let configToEdit = actualConfigurations[indexOfConfigToEdit];
        let k = configToEdit.length - 1;
        for (let i = currentCombination.length - 1; i >= 0; i--) {
          while (configToEdit[k] !== "X" && k >= 0) k--;
          configToEdit[k] = +currentCombination[i];
        }
        indexOfConfigToEdit++;
      }
      actualConfigurations.map((c) => {
        let address = toDecimal(c.join(""));
        memoryState[address] = +value;
      });
    }
  }
  let sum = 0;
  for (const state in memoryState) {
    sum += memoryState[state];
  }
  return sum;
};

const toFilledBinary = (dec, length) => {
  let toReturn = new Array(length).fill(0);
  toBinary(dec)
    .split("")
    .reverse()
    .map((number, index) => (toReturn[toReturn.length - 1 - index] = +number));
  return toReturn;
};

const toBinary = (dec) => {
  return (dec >>> 0).toString(2);
};

const toDecimal = (binary) => {
  return parseInt(binary, 2);
};
