import { Message } from 'amqplib'
import { MqAdapter } from './mqAdapter'

export class Worker {
  public mqAdapter: MqAdapter
  public job: (row: string) => string

  constructor(mqHost: string, mqPort: number, job: (row: string) => string) {
    this.mqAdapter = new MqAdapter(mqHost, mqPort)
    this.job = job
  }

  public async run(dispatcherQueue: string, sinkQueue: string) {
    try {
      await this.mqAdapter.connect()
      return this.mqAdapter.consume(dispatcherQueue, async data => {
        this.handle(sinkQueue, data)
      })
    } catch (error) {
      throw error
    }
  }

  private async handle(queue: string, data: Message | null) {
    if (!data) {
      return false
    }

    const { rows } = JSON.parse(data.content.toString())
    return rows.reduce(async (response: boolean, row: string) => {
      const result = await this.job(row)
      this.mqAdapter.send(queue, new Buffer(result))

      return response
    }, true)
  }
}
