import { connect } from 'amqplib'
import { Logger } from './logger'

export class Worker {
  public job: (row: any[], logger: Logger) => void
  public logger: Logger

  /* istanbul ignore next */
  constructor(job: (row: any[]) => void, logger: Logger) {
    this.job = job
    this.logger = logger

    this.logger.info(`Worker started`)
  }

  public async run(dispatcherQueue: string, sinkQueue: string) {
    const connection = await connect('amqp://localhost')
    const channel = await connection.createChannel()
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
