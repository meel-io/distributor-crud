const chalk = require('chalk')
const zmq = require('zmq')

const sink = zmq.socket('pull')

const run = port => {
  sink.bindSync(`tcp://*:${port}`)

  sink.on('message', buffer => {
    console.log('Message from worker: ', buffer.toString())
  })

  console.log(chalk.greenBright(`Sink started at port: ${port}`))
}

module.exports = { run }
