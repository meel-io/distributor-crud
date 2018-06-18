import { Batch } from './batch'
import { MqAdapter } from './mqAdapter'

import { Stream, Writable } from 'stream'

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

  public async run(): Promise<Stream> {
    try {
      await this.mqAdapter.connect()

      return this.getStream()
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

  private getStream() {
    const stream = new Writable({
      write(chunk: Buffer, _: string, cb: (error?: string) => void) {
        this.process(chunk)
        cb()
      }
    })

    return stream
  }
}
