const chalk = require('chalk')
const zmq = require('zmq')
const { createStream } = require('./stream')

const dispatcher = zmq.socket('push')
const port = process.env.DISPATCHER_PORT || 5016

dispatcher.bindSync(`tcp://*:${port}`)

const nameGeneratorStream = createStream()

const batchSize = 10
let batch = []

nameGeneratorStream
  .on('data', name => {
    batch.push(name)
    if (batch.length === batchSize) {
      dispatcher.send(JSON.stringify({ rows: batch }))
      batch = []
    }
  })
  .on('end', () => {
    dispatcher.send(JSON.stringify({ rows: batch }))
  })

dispatcher.on('accept', () => {
  console.log(chalk.greenBright('Worker accepted'))
})

console.log(chalk.greenBright(`Dispatcher started at port: ${port}`))
