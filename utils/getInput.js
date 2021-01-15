const fs = require("fs");
const { get } = require("http");

function getInput(filePath, cb) {
  var lineReader = require("readline").createInterface({
    input: fs.createReadStream(filePath),
  });

  const input = [];

  lineReader.on("line", function (line) {
    input.push(line);
  });

  lineReader.on("close", () => {
    cb(input);
  });
}

module.exports = getInput;
