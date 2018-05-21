import { connect, Message } from 'amqplib'
import { Logger } from './logger'

export class Sink {
  public queue: string
  public logger: Logger

  /* istanbul ignore next */
  constructor(queue: string, logger: Logger) {
    this.queue = queue
    this.logger = logger

    this.logger.info(`Sink will consume queue: ${queue}`)
  }

  public async run() {
    try {
      const connection = await connect('amqp://localhost')
      const channel = await connection.createChannel()
      const assertedQueue = await channel.assertQueue(this.queue)

      channel.consume(assertedQueue.queue, msg => {
        if (msg) {
          this.logger.info(`Message from worker:  ${msg.content.toString()}`)
        }
      })
    } catch (error) {
      this.logger.error(`Error asserting sink queue:  ${error}`)
    }
  }
}
