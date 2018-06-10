import { Batch } from './batch'
import { MqAdapter } from './mqAdapter'

import { Stream } from 'stream'

export class Dispatcher {
  private mqAdapter: MqAdapter
  private queue: string
  private batch: Batch

  constructor(
    mqHost: string,
    mqPort: number,
    queue: string,
    batchSize: number = 10
  ) {
    this.mqAdapter = new MqAdapter(mqHost, mqPort)
    this.queue = queue
    this.batch = new Batch(batchSize)
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
