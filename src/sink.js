const chalk = require('chalk')
const { bindSocket, mode } = require('mqAdapter')

const run = port => {
  const sink = bindSocket(mode.pull, port)

  sink.on('message', buffer => {
    console.log('Message from worker: ', buffer.toString())
  })

  console.log(chalk.greenBright(`Sink started at port: ${port}`))
}

module.exports = { run }
