const getInput = require("../../utils/getInput");
const path = require("path");


const rules = 'gs';
const validationData = {
    byr: new RegExp(/^(19[2-9][0-9]|200[0-2])$/),
    iyr: new RegExp(/^(201[0-9]|2020)$/),
    eyr: new RegExp(/^(202[0-9]|2030)$/),
    hgt: new RegExp(/^((1([5-8][0-9])|19[0-3])cm)$|^((59|6[0-9]|7[0-6])in)$/),
    hcl: new RegExp(/^#([0-9]|[a-f]){6}$/),
    ecl: new RegExp(/^amb|blu|brn|gry|grn|hzl|oth$/),
    pid: new RegExp(/^[0-9]{9}$/),
    cid: new RegExp(/.*/),
}

getInput(path.join(__dirname, "input.txt"), (input) => {
    input.push("");
    let passport = {};
    let validCount = 0;
    for (let i = 0; i < input.length; i++) {
        const line = input[i];
        if (line === "") {
            if (isPassportValid(passport)) {
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

const isPassportValid = (passport) => {
    const keysToCheck = Object.keys(passport);
    const keysCount = keysToCheck.length;
    if (keysCount < 7 || keysCount === 7 && passport['cid']) {
        return false;
    }

    for (let key of keysToCheck) {
        const validator = validationData[key];
        if (!validator || !validator.test(passport[key]))
            return false;
    }
    return true;
}
