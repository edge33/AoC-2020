const getInput = require('../../utils/getInput')
const path = require('path')
getInput(path.join(__dirname, 'rules.txt'), (rules) => {
  let rulesSet = {}
  let doneRules = []

  getRules(rules, rulesSet, doneRules)

  let regexpString = getRegexp(rulesSet, doneRules)
  getInput(path.join(__dirname, 'input.txt'), (input) => {
    console.log('answer 1:', countMatches(input, regexpString))
    let rule42 = rulesSet['42'].join('')
    let rule8 = `(${rule42})|(${rule42})+`
    let rule31 = rulesSet['31'].join('')
    let rule11 = `((${rule42})(${rule31}))|((${rule42})(${rule42})(${rule31})(${rule31}))|((${rule42})(${rule42})(${rule42})(${rule31})(${rule31})(${rule31}))|((${rule42})(${rule42})(${rule42})(${rule42})(${rule31})(${rule31})(${rule31})(${rule31}))`
    doneRules = []
    rulesSet = {}
    getRules(rules, rulesSet, doneRules)
    rulesSet['8'] = [rule8]
    rulesSet['41'] = [rule42]
    rulesSet['31'] = [rule31]
    rulesSet['11'] = [rule11]
    doneRules = doneRules.concat(['8', '41', '31', '11'])
    regexpString = getRegexp(rulesSet, doneRules)
    console.log('answer 2:', countMatches(input, regexpString))
  })
})

const countMatches = (input, regexpString) => {
  let regexp = new RegExp(regexpString)
  let count = 0
  for (const line of input) {
    if (line.match(regexp)) {
      count++
    }
  }
  return count
}

const getRegexp = (rulesSet, doneRules) => {
  let ruleKeys = Object.keys(rulesSet)
  while (doneRules.length < ruleKeys.length) {
    for (let i = 0; i < ruleKeys.length; i++) {
      let ruleChars = rulesSet[ruleKeys[i]]
      for (let j = 0; j < ruleChars.length; j++) {
        let currDoneRule = doneRules.find((r) => r === ruleChars[j])
        if (!currDoneRule) {
          continue
        }
        if (ruleChars[j] === currDoneRule) {
          let replacement = rulesSet[currDoneRule]
          ruleChars[j] = replacement.join('').replace(/(.*)/, '($1)')
        }
      }
    }
    for (let i = 0; i < ruleKeys.length; i++) {
      let chars = rulesSet[ruleKeys[i]]
      let done = true
      for (let char of chars) {
        if (Number.parseInt(char)) {
          done = false
          break
        }
      }
      if (done) {
        if (doneRules.indexOf(ruleKeys[i]) === -1) {
          doneRules.push(ruleKeys[i])
        }
      }
    }
  }
  return `^${rulesSet['0'].join('')}$`
}

const getRules = (rules, rulesSet, doneRules) => {
  for (let line of rules) {
    let match = line.match(/(\d+): "(\S+)"/)
    if (match) {
      let [_, rule, char] = match
      rulesSet[rule] = [char]
      doneRules.push(rule)
    } else {
      match = line.match(/(\d+):(.*)/)
      let [_, rule, splitGroup] = match
      rulesSet[rule] = splitGroup.trim().split(' ')
    }
  }
}
