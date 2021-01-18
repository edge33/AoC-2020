const getInput = require('../../utils/getInput')
const path = require('path')

class Node {
  constructor(data, next = null) {
    ;(this.data = data), (this.next = next)
  }
}
class CircularLinkedList {
  constructor() {
    this.head = null
    this.tail = null
  }

  pushBack(data) {
    let newNode = new Node(data)
    if (!this.head) {
      newNode.next = newNode
      this.head = newNode
      this.tail = newNode
      return newNode
    }

    newNode.next = this.head
    this.tail.next = newNode
    this.tail = newNode
    return newNode
  }

  removeNext(node) {
    if (!this.head) {
      return
    }

    if (node.next === this.tail) {
      this.tail = this.head
    }
    if (node.next === this.head) {
      this.head = node
    }
    node.next = node.next.next
  }
}

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let circle = new CircularLinkedList()
  let lookupTable = new Array(input[0].length)
  let max = -1
  input[0].split('').map((n, i) => {
    let node = circle.pushBack(+n)
    lookupTable[+n] = node
    if (+n > max) {
      max = +n
    }
  })
  let result = runGame(circle, lookupTable, max, 100)
  const answer1 = result.join('')
  console.log(answer1)
  circle = new CircularLinkedList()
  lookupTable = new Array(1000001)
  let maxValue = -1
  input[0].split('').map((n, i) => {
    let node = circle.pushBack(+n)
    lookupTable[+n] = node
    if (+n > maxValue) {
      maxValue = +n
    }
  })

  max = lookupTable.length - 1
  for (let i = maxValue + 1; i < lookupTable.length; i++) {
    let node = circle.pushBack(i)
    lookupTable[i] = node
  }
  let answer2 = runGame(circle, lookupTable, max, 10000000, false)
  console.log(answer2)
})

const runGame = (circle, lookupTable, max, numberOfMoves, buildArray = true) => {
  let currentNode = circle.head
  for (let i = 1; i <= numberOfMoves; i++) {
    let pickup = [currentNode.next, currentNode.next.next, currentNode.next.next.next]

    let destinationNode = null
    let destinationItemValue = lookupTable[currentNode.data].data - 1
    if (destinationItemValue === 0) {
      destinationItemValue = max
    }
    circle.removeNext(currentNode)
    circle.removeNext(currentNode)
    circle.removeNext(currentNode)
    currentNode = currentNode.next
    while (
      destinationItemValue === pickup[0].data ||
      destinationItemValue === pickup[1].data ||
      destinationItemValue === pickup[2].data
    ) {
      destinationItemValue--
      if (destinationItemValue === 0) {
        destinationItemValue = max
        while (
          destinationItemValue === pickup[0].data ||
          destinationItemValue === pickup[1].data ||
          destinationItemValue === pickup[2].data
        ) {
          destinationItemValue--
        }
      }
    }
    destinationNode = lookupTable[destinationItemValue]
    let next = destinationNode.next
    destinationNode.next = pickup[0]
    pickup[2].next = next
  }
  let result = []
  if (buildArray) {
    result.push(lookupTable[1].next.data)
    let curr = lookupTable[1].next
    for (let i = 0; i < lookupTable.length - 1; i++) {
      curr = curr.next
      result.push(curr.data)
    }
    return result
  }
  return lookupTable[1].next.data * lookupTable[1].next.next.data
}
