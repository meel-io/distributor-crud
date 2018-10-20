import { Batch } from './batch'
import { MqAdapter } from './mqAdapter'

import { Duplex } from 'stream'

export class Dispatcher {
  private mqAdapter: MqAdapter
  private queue: string
  private batch: Batch

  constructor (
    mqHost: string,
    mqPort: number,
    queue: string,
    batchSize: number = 10
  ) {
    this.mqAdapter = new MqAdapter(mqHost, mqPort)
    this.queue = queue
    this.batch = new Batch(batchSize)
  }

  public getStream () {
    return new Duplex({
      read: () => this.batch.rows,
      write: (row: Buffer, encoding: string, cb: (error?: string) => void) =>
        this.process(row, encoding, cb)
    })
  }

  public async run (): Promise<void> {
    try {
      await this.mqAdapter.connect()
    } catch (error) {
      throw error
    }
  }

  private process (row: Buffer, encoding: string, cb: (error?: string) => void) {
    this.batch.push(row, encoding)
    if (this.batch.full()) {
      this.send()
      this.batch.clear()
    }
    cb()
  }

  private send () {
    this.mqAdapter.send(
      this.queue,
      Buffer.from(JSON.stringify({ rows: this.batch.rows }))
    )
  }
}
