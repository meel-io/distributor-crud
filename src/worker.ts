import { connect, Message } from 'amqplib'
import { Logger } from './logger'
import { MqAdapter } from './mqAdapter'

export class Worker {
  public mqAdapter: MqAdapter
  public job: (row: any[], logger: Logger) => void
  public logger: Logger

  /* istanbul ignore next */
  constructor(mqHost: string, job: (row: any[]) => void, logger: Logger) {
    this.mqAdapter = new MqAdapter(mqHost)
    this.job = job
    this.logger = logger

    this.logger.info(`Worker started`)
  }

  public async run(dispatcherQueue: string, sinkQueue: string) {
    try {
      await this.mqAdapter.connect()
      await this.mqAdapter.consume(dispatcherQueue, async data => {
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
    rows.reduce(async (response: boolean, row: any[]) => {
      const result = await this.job(row, this.logger)
      this.mqAdapter.send(queue, new Buffer(`Result sent by worker: ${result}`))

      return response
    }, true)
  }
}
