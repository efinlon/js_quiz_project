import { KeyObject } from 'crypto'
import fs from 'fs'

export const chooseRandom = (array, numItems) => {
  let items = array
  if (array === undefined) {
    array = []
    return array
  }
  if (array.length === 1 || array.length === 0) {
    items = array
    return array
  }
  if (!numItems || numItems < 1 || numItems > array.length) {
    numItems = Math.floor(Math.random() * array.length)
  }
  let resultArray = []
  for (let i = 0; i < numItems; i++) {
    resultArray.push(items.splice(Math.floor(Math.random() * items.length), 1))
  }
  return resultArray
}

export const createPrompt = prompt => {
  let result = []
  let questions
  let choices

  if (!prompt || prompt.numQuestions == undefined) {
    questions = 1
  }
  if (!prompt || prompt.numChoices == undefined) {
    choices = 2
  } else {
    questions = Number.parseInt(prompt.numQuestions)
    choices = Number.parseInt(prompt.numChoices)
  }

  for (let i = 1; i <= questions; i++) {
    result.push({
      type: 'input',
      name: `question-${i}`,
      message: `Enter question ${i}`
    })
    for (let q = 1; q <= choices; q++) {
      result.push({
        type: 'input',
        name: `question-${i}-choice-${q}`,
        message: `Enter answer choice ${q} for question ${i}`
      })
    }
  }
  return result
}

export const createQuestions = questions => {
  let result = []
  let choices = []
  let count = -1
  for (let item in questions) {
    if (item.length <= 12) {
      choices = []
      result.push({
        type: 'list',
        name: item,
        message: questions[item]
      })
      count++
    }
    if (item.length > 12) {
      choices.push(questions[item])
      result[count].choices = choices
    }
  }
  return result
}

export const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)))
  })

export const writeFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path + '.json', data, err =>
      err ? reject(err) : resolve('File saved successfully')
    )
  })
