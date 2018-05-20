import { Channel, connect } from 'amqplib'
import { Stream } from 'stream'
import { Logger } from './logger'

export class Batch {
  public rows: any
  public size: number

  constructor(batchSize = 10) {
    this.size = batchSize
    this.rows = []
  }

  public push(row: Buffer): void {
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
  private queue: string
  private logger: Logger

  /* istanbul ignore next */
  constructor(queue: string, logger: Logger, batchSize: number = 10) {
    this.batch = new Batch(batchSize)
    this.queue = queue
    this.logger = logger

    this.logger.info(`Dispatcher will use queue: ${queue}`)
  }

  public async run(stream: Stream) {
    const connection = await connect('amqp://localhost')
    const channel = await connection.createChannel()

    stream.on('data', data => this.process(channel, data))
    stream.on('end', () => this.send(channel))
  }

  public process(channel: Channel, row: Buffer) {
    this.batch.push(row)
    if (this.batch.full()) {
      this.send(channel)
      this.batch.clear()
    }
  }

  public send(channel: Channel) {
    channel.sendToQueue(
      this.queue,
      new Buffer(JSON.stringify({ rows: this.batch.rows }))
    )
  }
}
