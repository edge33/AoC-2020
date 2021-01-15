const getInput = require("../../utils/getInput");
const path = require("path");

getInput(path.join(__dirname, "input.txt"), (input) => {
    input.push("");
    let passport = {};
    let validCount = 0;
    for (let i = 0; i < input.length; i++) {
        const line = input[i];
        if (line === "") {
            const keysCount = Object.keys(passport).length;
            if (keysCount === 8 || (keysCount === 7 && !passport["cid"])) {
                validCount++;
            }
            passport = {};
        } else {
            splitToObj(passport, line);
        }
    }
    console.log(validCount);
});

splitToObj = (obj, line) => {
    const values = line.split(" ");
    for (let value of values) {
        const keyValuePair = value.split(":");
        obj[keyValuePair[0]] = keyValuePair[1];
    }
};
