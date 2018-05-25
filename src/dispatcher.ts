import { Batch } from './batch'
import { Logger } from './logger'
import { MqAdapter } from './mqAdapter'

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
    try {
      await this.mqAdapter.connect()
      stream.on('data', data => this.process(data))
      stream.on('end', () => this.send())
    } catch (error) {
      throw error
    }
  }

  public process(row: Buffer) {
    this.batch.push(row)
    if (this.batch.full()) {
      this.send()
      this.batch.clear()
    }
  }

  public send() {
    this.mqAdapter.send(
      this.queue,
      new Buffer(JSON.stringify({ rows: this.batch.rows }))
    )
  }
}
