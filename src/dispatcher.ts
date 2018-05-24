import { Batch } from './batch'
import { Logger } from './logger'
import { MqAdapter } from './mqAdapter'

import { Channel } from 'amqplib'
import { Stream } from 'stream'

export class Dispatcher {
  private mqAdapter: MqAdapter
  private queue: string
  private logger: Logger
  private batch: Batch

  /* istanbul ignore next */
  constructor(
    mqHost: string,
    queue: string,
    logger: Logger,
    batchSize: number = 10
  ) {
    this.mqAdapter = new MqAdapter(mqHost)
    this.queue = queue
    this.logger = logger
    this.batch = new Batch(batchSize)

    this.logger.info(`Dispatcher will use queue: ${queue}`)
  }

  public async run(stream: Stream) {
    const channel = await this.mqAdapter.connect()

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
