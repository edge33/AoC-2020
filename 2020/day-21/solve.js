const getInput = require('../../utils/getInput')
const path = require('path')

getInput(path.join(__dirname, 'input.txt'), (input) => {
  let products = []
  let allergensMap = {}
  let allergensToSort = []
  for (let line of input) {
    let [ingredients, allergens] = line.split(' (contains ')
    let product = {
      ingredients: ingredients.split(' '),
      allergens: allergens.substr(0, allergens.length - 1).split(', '),
    }
    products.push(product)
    for (let allergen of product.allergens) {
      if (allergensToSort.indexOf(allergen) === -1) {
        allergensToSort.push(allergen)
      }
    }
  }

  buildAllergensMap(products, allergensMap)
  let withAllergens = []
  while (allergensToSort.length > 0) {
    let ingredients = Object.keys(allergensMap)
    for (let i = 0; i < ingredients.length; i++) {
      for (let allergen of allergensMap[ingredients[i]]) {
        let found = false
        for (let j = 0; j < ingredients.length; j++) {
          if (j === i) {
            continue
          }
          for (let currentAllergen of allergensMap[ingredients[j]]) {
            if (allergen.name === currentAllergen.name && allergen.count <= currentAllergen.count) {
              found = true
              break
            }
          }
        }
        if (!found) {
          delete allergensMap[ingredients[i]]
          withAllergens.push({ ingredient: ingredients[i], allergen })
          removeFromMap(allergensMap, allergen)
          allergensToSort = removeSortedAllergen(allergensToSort, allergen)
          ingredients = Object.keys(allergensMap)
        }
      }
    }
  }

  let noAllergenIngredients = Object.keys(allergensMap)
  let count = 0
  for (let p of products) {
    let ingrs = p.ingredients
    for (let i of noAllergenIngredients) {
      if (ingrs.indexOf(i) !== -1) {
        count++
      }
    }
  }
  console.log('answer 1:', count)
  console.log(
    'answer 2:',
    withAllergens
      .sort((a, b) => (a.allergen.name < b.allergen.name ? -1 : 1))
      .map((a) => a.ingredient)
      .join(',')
  )
})

const removeSortedAllergen = (allergensToSort, sortedAllergen) => {
  return allergensToSort.filter((a) => a !== sortedAllergen.name)
}

const removeFromMap = (allergensMap, allergen) => {
  for (let ingredient in allergensMap) {
    allergensMap[ingredient] = allergensMap[ingredient].filter((a) => a.name !== allergen.name)
  }
}

const buildAllergensMap = (products, allergensMap) => {
  for (let product of products) {
    for (let ingredient of product.ingredients) {
      if (allergensMap[ingredient]) {
        for (let allergen of product.allergens) {
          let itemIndex = allergensMap[ingredient].findIndex((a) => a.name === allergen)
          if (itemIndex !== -1) {
            allergensMap[ingredient][itemIndex].count += 1
          } else {
            allergensMap[ingredient].push({
              name: allergen,
              count: 1,
            })
          }
        }
      } else {
        allergensMap[ingredient] = product.allergens.map((a) => {
          return {
            name: a,
            count: 1,
          }
        })
      }
    }
  }
}
