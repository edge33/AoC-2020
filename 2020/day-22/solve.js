const getInput = require('../../utils/getInput')
const path = require('path')

class Queue extends Array {
  enqueue(val) {
    this.push(val)
  }

  dequeue() {
    return this.shift()
  }

  peek() {
    return this[0]
  }

  isEmpty() {
    return this.length === 0
  }
}

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let player1Deck = new Queue()
  let player2Deck = new Queue()
  let currentPlayer = player1Deck
  for (line of input) {
    if (line.match(/Player 1/)) {
      currentPlayer = player1Deck
    } else if (line.match(/Player 2/)) {
      currentPlayer = player2Deck
    } else if (line !== '') {
      currentPlayer.enqueue(+line)
    }
  }

  // console.log(player1Deck);
  // console.log(player2Deck);
  // return
  // let answer1 = playCombat(player1Deck.slice(), player2Deck.slice())
  // console.log(answer1)
  let answer2 = playRecursiveCombat(player1Deck.slice(), player2Deck.slice())
  console.log(answer2)
  // console.log(player1Deck)
  // console.log(player2Deck)
})

const playCombat = (deck1, deck2) => {
  while (!deck1.isEmpty() && !deck2.isEmpty()) {
    let player1Card = deck1.dequeue()
    let player2Card = deck2.dequeue()
    if (player1Card > player2Card) {
      // console.log(player1Card, player2Card, 'player 1 wins');
      deck1.enqueue(player1Card)
      deck1.enqueue(player2Card)
    } else {
      // console.log(player1Card, player2Card, 'player 2 wins');
      deck2.enqueue(player2Card)
      deck2.enqueue(player1Card)
    }
  }
  // console.log(deck1)
  // console.log(deck2)
  return computeWinnersScore(deck1.isEmpty() ? deck2 : deck1)
}

const computeWinnersScore = (deck) => {
  let i = 1
  return deck.reverse().reduce((acc, curr) => acc + curr * i++, 0)
}

const playRecursiveCombat = (deck1, deck2) => {
  let winner = playGame(deck1, deck2, [])
  return computeWinnersScore(winner === 1 ? deck1 : deck2)
}

let nextGame = [1]

const playGame = (deck1, deck2, previousRounds) => {
  let g = nextGame[nextGame.length - 1]
  if (g % 1000 === 0) {
    console.log(`=== Game ${nextGame[nextGame.length - 1]} ===`)
  }
  nextGame.push(g + 1)
  // console.log()
  let r = 1
  while (!deck1.isEmpty() && !deck2.isEmpty()) {
    // console.log('previous rounds in this game', previousRounds)
    if (isAlreadyPlayed(previousRounds, deck1, deck2)) {
      // console.log('round already played')
      return 1
    }
    // console.log(`-- Round ${r} (Game ${g}) --`)
    previousRounds.push({ deck1: deck1.slice(), deck2: deck2.slice() })
    playRound(deck1, deck2, r, g)
    // console.log()
    r++
  }
  let winner = deck1.isEmpty() ? 2 : 1
  // console.log(`The winner of game ${g} is player ${winner}!`)
  // console.log()
  lastGamePlayed = g
  return deck1.isEmpty() ? 2 : 1
}

const playRound = (deck1, deck2, r, g) => {
  // console.log("Player 1's deck:", deck1.join(' '))
  // console.log("Player 2's deck:", deck2.join(' '))
  const player1Card = deck1.dequeue()
  const player2Card = deck2.dequeue()
  // console.log('Player 1 plays:', player1Card)
  // console.log('Player 2 plays:', player2Card)
  if (deck1.length >= player1Card && deck2.length >= player2Card) {
    //recurse
    // console.log('Playing a sub-game to determine the winner...')
    // console.log()

    let subDeck1 = deck1.slice(0, player1Card)
    let subDeck2 = deck2.slice(0, player2Card)
    // console.
    let winner = playGame(subDeck1, subDeck2, [], g + 1)

    if (winner === 1) {
      deck1.enqueue(player1Card)
      deck1.enqueue(player2Card)
    } else {
      deck2.enqueue(player2Card)
      deck2.enqueue(player1Card)
    }
  } else {
    if (player1Card > player2Card) {
      // console.log(`Player 1 wins round ${r} of game ${g}!`)
      // console.log()
      deck1.enqueue(player1Card)
      deck1.enqueue(player2Card)
    } else {
      // console.log(`Player 2 wins round ${r} of game ${g}!`)
      // console.log()
      deck2.enqueue(player2Card)
      deck2.enqueue(player1Card)
    }
  }
}

const isAlreadyPlayed = (previousRounds, deck1, deck2) => {
  for (let round of previousRounds) {
    if (round.deck1.join('') === deck1.join('') && round.deck2.join('') === deck2.join('')) {
      return true
    }
  }
  return false
}
