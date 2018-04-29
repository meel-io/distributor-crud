import { Stream } from 'stream'
import { Logger } from './logger'
import { bindSocket, Mode, Socket } from './mqAdapter'

/* istanbul ignore next */
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
  private batch: Batch
  private socket: Socket
  private logger: Logger

  /* istanbul ignore next */
  constructor(port: number, logger: Logger, batchSize: number = 10) {
    this.batch = new Batch(batchSize)
    this.socket = bindSocket(Mode.Push, port)
    this.logger = logger

    this.logger.info(`Dispatcher started at port: ${port}`)
  }

  public run(stream: Stream) {
    stream.on('data', data => this.process(data))
    stream.on('end', () => this.send())

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
