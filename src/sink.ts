import { Logger } from './logger'
import { bindSocket, Mode } from './mqAdapter'

const run = (port: number, logger: Logger) => {
  const sink = bindSocket(Mode.Pull, port)

  sink.on('message', (buffer: Buffer) => {
    logger.info(`Message from worker:  ${buffer.toString()}`)
  })

  logger.info(`Sink started at port: ${port}`)
}

export { run }
