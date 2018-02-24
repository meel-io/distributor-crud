import { Stream } from 'stream'
import { Logger } from './logger'
import { bindSocket, Mode, Socket } from './mqAdapter'

export class Batch {
  public rows: any
  public size: number

  constructor(batchSize = 10) {
    this.size = batchSize
    this.rows = []
  }

  public push(row: any): void {
    this.rows.push(row)
  }

  public full(): boolean {
    return this.rows.length === this.size
  }

  public clear(): void {
    this.rows = []
  }
}

export class Dispatcher {
  public batch: Batch
  public socket: Socket
  public logger: Logger

  constructor(port: number, batchSize: number = 10, logger: Logger) {
    this.batch = new Batch(batchSize)
    this.socket = bindSocket(Mode.Push, port)
    this.logger = logger

    this.logger.info(`Dispatcher started at port: ${port}`)
  }

  public run(stream: Stream) {
    stream.on('data', this.process)
    stream.on('end', this.send)

    this.socket.on('accept', () => {
      this.logger.info('Worker accepted')
    })
  }

  public process(row: any) {
    this.batch.push(row)
    if (this.batch.full()) {
      this.send()
      this.batch.clear()
    }
  }

  public send() {
    this.socket.send(JSON.stringify({ rows: this.batch.rows }))
  }
}
