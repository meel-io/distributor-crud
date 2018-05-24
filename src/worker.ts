import { connect } from 'amqplib'
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
    const channel = await this.mqAdapter.connect()
    const assertedQueue = await channel.assertQueue(dispatcherQueue)

    channel.consume(assertedQueue.queue, async data => {
      if (data) {
        const { rows } = JSON.parse(data.toString())
        rows.map(async (row: any[]) => {
          const result = await this.job(row, this.logger)
          channel.sendToQueue(
            sinkQueue,
            new Buffer(`Result sent by worker: ${result}`)
          )
        })
      }
    })
  }
}
