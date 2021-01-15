const getInput = require("../../utils/getInput");
const path = require("path");

const rotationMatrixes = {
  R90: [
    [0, 1],
    [-1, 0],
  ],
  R180: [
    [-1, 0],
    [0, -1],
  ],
  R270: [
    [0, -1],
    [1, 0],
  ],
  L90: [
    [0, -1],
    [1, 0],
  ],
  L180: [
    [-1, 0],
    [0, -1],
  ],
  L270: [
    [0, 1],
    [-1, 0],
  ],
};

getInput(path.join(__dirname, "input.txt"), (input) => {
  const instructions = [];
  const regexp = /^([A-Z])(\d+)$/;

  for (const line of input) {
    const [_, direction, amount] = line.match(regexp);
    instructions.push({ direction: direction, value: +amount });
  }
  const answer1 = navigation1(instructions);
  console.log(answer1);
  const answer2 = navigation2(instructions);
  console.log(answer2);
});

const navigation1 = (instructions) => {
  const ship = {
    direction: 90,
    east: 0,
    north: 0,
  };
  for (const instruction of instructions) {
    moveShip(instruction, ship);
  }
  return Math.abs(ship.east) + Math.abs(ship.north);
};

const moveShip = (instruction, ship) => {
  switch (instruction.direction) {
    case "N":
      ship.north += instruction.value;
      break;
    case "S":
      ship.north -= instruction.value;
      break;
    case "E":
      ship.east += instruction.value;
      break;
    case "W":
      ship.east -= instruction.value;
      break;
    case "L":
      ship.direction = (ship.direction - instruction.value + 360) % 360;
      break;
    case "R":
      ship.direction = (ship.direction + instruction.value) % 360;
      break;
    case "F":
      switch (ship.direction) {
        case 0:
          ship.north += instruction.value;
          break;
        case 90:
          ship.east += instruction.value;
          break;
        case 180:
          ship.north -= instruction.value;
          break;
        case 270:
          ship.east -= instruction.value;
          break;
      }
      break;
  }
};

const navigation2 = (instructions) => {
  const ship = {
    direction: 90,
    east: 0,
    north: 0,
  };
  const wayPoint = {
    east: ship.east + 10,
    north: ship.north + 1,
  };

  for (const instruction of instructions) {
    if (instruction.direction === "F") {
      moveShipToWaypoint(instruction.value, ship, wayPoint);
    } else {
      moveWaypoint(instruction.direction, instruction.value, wayPoint);
    }
  }
  // console.log("ship", ship);
  // console.log("wayPoint", wayPoint);
  return Math.abs(ship.east) + Math.abs(ship.north);
};

const moveWaypoint = (direction, value, wayPoint) => {
  switch (direction) {
    case "N":
      wayPoint.north += value;
      break;
    case "S":
      wayPoint.north -= value;
      break;
    case "E":
      wayPoint.east += value;
      break;
    case "W":
      wayPoint.east -= value;
      break;
    case "L":
    case "R":
      const rotatedWayPoint = getRotatedWayPoint(
        wayPoint,
        rotationMatrixes[`${direction}${value}`]
      );
      wayPoint.east = rotatedWayPoint.east;
      wayPoint.north = rotatedWayPoint.north;
      break;
  }
};

const getRotatedWayPoint = (wayPoint, rotationMatrix) => {
  return {
    east:
      wayPoint.east * rotationMatrix[0][0] +
      wayPoint.north * rotationMatrix[0][1],
    north:
      wayPoint.east * rotationMatrix[1][0] +
      wayPoint.north * rotationMatrix[1][1],
  };
};

const moveShipToWaypoint = (times, ship, waypoint) => {
  ship.north = ship.north + waypoint.north * times;
  ship.east = ship.east + waypoint.east * times;
};
