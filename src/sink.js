const chalk = require('chalk')
const { bindSocket, Mode } = require('mqAdapter')

const run = port => {
  const sink = bindSocket(Mode.Pull, port)

  sink.on('message', buffer => {
    console.log('Message from worker: ', buffer.toString())
  })

  console.log(chalk.greenBright(`Sink started at port: ${port}`))
}

module.exports = { run }
