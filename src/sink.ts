import { Logger } from './logger'
import { bindSocket, Mode, Socket } from './mqAdapter'

export class Sink {
  public socket: Socket
  public logger: Logger

  /* istanbul ignore next */
  constructor(port: number, logger: Logger) {
    this.socket = bindSocket(Mode.Pull, port)
    this.logger = logger

    this.logger.info(`Sink started at port: ${port}`)
  }

  public run() {
    this.socket.on('message', (buffer: Buffer) => {
      this.logger.info(`Message from worker:  ${buffer.toString()}`)
    })
  }
}
