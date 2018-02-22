import { Stream } from 'stream'
import { Logger } from './logger'
import { bindSocket, Mode, Socket } from './mqAdapter'

export class Batch {
  rows: any
  size: number

  constructor(batchSize = 10) {
    this.size = batchSize
    this.rows = []
  }
  push(row: any): void {
    this.rows.push(row)
  }
  full(): boolean {
    return this.rows.length === this.size
  }
  clear(): void {
    this.rows = []
  }
}

export class Dispatcher {
  batch: Batch
  socket: Socket
  logger?: Logger

  constructor(port: number, batchSize: number = 10, logger: Logger) {
    this.batch = new Batch(batchSize)
    this.socket = bindSocket(Mode.Push, port)
    this.logger = logger || new Logger()

    this.logger.info(`Dispatcher started at port: ${port}`)
  }

  run(stream: Stream) {
    stream.on('data', this.process)
    stream.on('end', this.send)

    this.socket.on('accept', () => {
      //this.logger.info('Worker accepted')
    })
  }

  process(row: any) {
    this.batch.push(row)
    if (this.batch.full()) {
      this.send()
      this.batch.clear()
    }
  }

  send() {
    this.socket.send(JSON.stringify({ rows: this.batch.rows }))
  }
}
