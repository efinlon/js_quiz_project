import vorpal from 'vorpal'
import { prompt } from 'inquirer'

import {
  readFile,
  writeFile,
  chooseRandom,
  createPrompt,
  createQuestions
} from './lib'

const cli = vorpal()

const askForQuestions = [
  {
    type: 'input',
    name: 'numQuestions',
    message: 'How many questions do you want in your quiz?',
    validate: input => {
      const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/)
      return pass ? true : 'Please enter a valid number!'
    }
  },
  {
    type: 'input',
    name: 'numChoices',
    message: 'How many choices should each question have?',
    validate: input => {
      const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/)
      return pass ? true : 'Please enter a valid number!'
    }
  }
]

const createQuiz = title =>
  prompt(askForQuestions)
    .then(answer => createPrompt(answer))
    .then(promptArray => prompt(promptArray))
    .then(answerObject => createQuestions(answerObject))
    .then(quizObject => writeFile(title, JSON.stringify(quizObject)))
    .then(() => console.log('Quiz saved successfully'))
    .catch(err => console.log('Error creating the quiz.', err))

const takeQuiz = (title, output) =>
  readFile(title + '.json')
    .then(data => JSON.parse(data))
    .then(quiz => prompt(quiz))
    .then(answers => writeFile(output, JSON.stringify(answers)))
    .catch(err => console.log('Error taking the quiz', err))

const takeRandomQuiz = (quizzes, output, n) =>
  Promise.all(quizzes.map(quizName => readFile(quizName + '.json')))
    .then(rawDataArray => rawDataArray.flatMap(rawData => JSON.parse(rawData)))
    .then(questions => chooseRandom(questions, n))
    .then(quizObject => writeFile(output, JSON.stringify(quizObject)))
    .then(() => console.log('Random Quiz saved successfully'))
    .catch(err => console.log('Error creating the random quiz', err))

cli
  .command(
    'create <fileName>',
    'Creates a new quiz and saves it to the given fileName'
  )
  .action(function (input, callback) {
    return createQuiz(input.fileName)
  })

cli
  .command(
    'take <fileName> <outputFile>',
    'Loads a quiz and saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    return takeQuiz(input.fileName, input.outputFile)
  })

cli
  .command(
    'random <outputFile> <n> <fileNames...>',
    'Loads a quiz or' +
      ' multiple quizes and selects a random number of questions from each quiz.' +
      ' Then, saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    return takeRandomQuiz(input.fileNames, input.outputFile, input.n)
  })

cli.delimiter(cli.chalk['yellow']('quizler>')).show()
