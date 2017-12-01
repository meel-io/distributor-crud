const zmq = require('zmq')
const { createStream } = require('./stream')

const dispatcher = zmq.socket('push')
dispatcher.bindSync('tcp://*:5000')

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
