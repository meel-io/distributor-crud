import chalk from 'chalk'
import { bindSocket, Mode } from './mqAdapter'

const run = (port: number) => {
  const sink = bindSocket(Mode.Pull, port)

  sink.on('message', (buffer: Buffer) => {
    console.log('Message from worker: ', buffer.toString())
  })

  console.log(chalk.greenBright(`Sink started at port: ${port}`))
}

export { run }
