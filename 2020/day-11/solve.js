const getInput = require("../../utils/getInput");
const path = require("path");

const FREE = "L";
const NOT_FREE = "#";
const CORRIDOR = ".";

getInput(path.join(__dirname, "input.txt"), (input) => {
  const state = [];
  const oldState = [];
  for (const line of input) {
    state.push(line.split(""));
    oldState.push(line.split(""));
  }

  evolve(state, oldState, canChangeStateNeighborhood);
  // evolve(state, oldState, canChangeStatusInPath)
});

evolve = (input, backup, canChangeState) => {
  let oldState = backup;
  let state = input;
  let changed = true;
  let occupiedSeats = 0;
  let evoCount = 0;
  while (changed) {
    evoCount++;
    occupiedSeats = 0;
    changed = false;
    for (let i = 0; i < oldState.length; i++) {
      for (let j = 0; j < oldState[i].length; j++) {
        const element = oldState[i][j];
        if (element === CORRIDOR) {
          continue;
        }
        if (canChangeState(oldState, i, j, element)) {
          changed = true;
          state[i][j] = element === FREE ? NOT_FREE : FREE;
        } else {
          state[i][j] = element;
          occupiedSeats =
            element === NOT_FREE ? occupiedSeats + 1 : occupiedSeats;
        }
      }
    }
    let tmp = oldState;
    oldState = state;
    state = tmp;
  }
  console.log(evoCount - 1, occupiedSeats);
};

const canChangeStateNeighborhood = (state, i, j, currentStatus) => {
  const { startI, startJ, endI, endJ } = getIndexes(state, i, j);
  let occupiedCount = 0;
  for (let curI = startI; curI <= endI; curI++) {
    for (let curJ = startJ; curJ <= endJ; curJ++) {
      if ((i === curI && j === curJ) || state[curI][curJ] === CORRIDOR)
        continue;
      if (state[curI][curJ] === NOT_FREE) {
        occupiedCount++;
      }
    }
  }
  if (currentStatus === FREE) {
    return occupiedCount === 0;
  }
  return occupiedCount >= 4;
};

const getFirstVisibleSeatStatus = (state, i, j, iDirection, jDirection) => {
  // If I reached the edge of the board I just consider the hypothetical seats as corridor.
  if (i < 0) return CORRIDOR;
  if (i > state.length - 1) return CORRIDOR;
  if (j < 0) return CORRIDOR;
  if (j > state[i].length - 1) return CORRIDOR;

  if (state[i][j] === CORRIDOR)
    return getFirstVisibleSeatStatus(
      state,
      i + iDirection,
      j + jDirection,
      iDirection,
      jDirection
    );
  return state[i][j];
};

const canChangeStatusInPath = (state, i, j, status) => {
  const { startI, startJ, endI, endJ } = getIndexes(state, i, j);

  const seats = [];
  // up
  seats.push(getFirstVisibleSeatStatus(state, i - 1, j, -1, 0));
  //down
  seats.push(getFirstVisibleSeatStatus(state, i + 1, j, 1, 0));
  //left
  seats.push(getFirstVisibleSeatStatus(state, i, j - 1, 0, -1));
  //right
  seats.push(getFirstVisibleSeatStatus(state, i, j + 1, 0, 1));
  //diag-left-up
  seats.push(getFirstVisibleSeatStatus(state, i - 1, j - 1, -1, -1));
  //diag-right-up
  seats.push(getFirstVisibleSeatStatus(state, i - 1, j + 1, -1, 1));
  //diag-left-down
  seats.push(getFirstVisibleSeatStatus(state, i + 1, j - 1, 1, -1));
  //diag right down
  seats.push(getFirstVisibleSeatStatus(state, i + 1, j + 1, 1, 1));

  let occupiedCount = seats.reduce((acc, curr) => {
    if (curr === NOT_FREE) return acc + 1; return acc
  }, 0);

  // if I am trying to occupy
  if (status === FREE) {
    return occupiedCount === 0;
  }
  // if I am trying to free
  return occupiedCount >= 5;
};

const canFree = (state, i, j) => {
  const { startI, startJ, endI, endJ } = getIndexes(state, i, j);
  let occupiedCount = 0;
  for (let curI = startI; curI <= endI && occupiedCount < 4; curI++) {
    for (let curJ = startJ; curJ <= endJ && occupiedCount < 4; curJ++) {
      if ((i === curI && j === curJ) || state[curI][curJ] === CORRIDOR)
        continue;
      if (state[curI][curJ] === NOT_FREE) {
        occupiedCount++;
      }
    }
  }
  return occupiedCount >= 4;
};

const getIndexes = (state, i, j) => {
  let startI = i - 1;
  let startJ = j - 1;
  let endI = i + 1;
  let endJ = j + 1;

  if (startI < 0) startI = 0;
  if (startJ < 0) startJ = 0;
  if (endI > state.length - 1) endI = state.length - 1;
  if (endJ > state[i].length - 1) endJ = state.length - 1;
  return { startI, startJ, endI, endJ };
};

printMatrix = (state) => {
  for (let line of state) {
    console.log(line.join(""));
  }
  console.log();
};
