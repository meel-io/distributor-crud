import { Batch } from './batch'
import { Logger } from './logger'
import { MqAdapter } from './mqAdapter'

import { Message } from 'amqplib'

export class Sink {
  public mqAdapter: MqAdapter
  public queue: string
  public logger: Logger

  /* istanbul ignore next */
  constructor(mqHost: string, queue: string, logger: Logger) {
    this.mqAdapter = new MqAdapter(mqHost)
    this.queue = queue
    this.logger = logger

    this.logger.info(`Sink will consume queue: ${queue}`)
  }

  public async run() {
    try {
      const channel = await this.mqAdapter.connect()
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
