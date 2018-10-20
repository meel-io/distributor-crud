import { Channel, connect, Message } from 'amqplib'
import * as pino from 'pino'

export { Message } from 'amqplib'

export class MqAdapter {
  public mqHost: string
  public mqPort: number
  public channel?: Channel
  private logger: pino.Logger

  constructor (mqHost: string, mqPort: number = 5672) {
    this.mqHost = mqHost
    this.mqPort = mqPort
    this.logger = pino()
  }

  public async connect () {
    try {
      const connection = await connect(`amqp://${this.mqHost}`)
      this.logger.info(`Connected to amqp://${this.mqHost}`)
      this.channel = await connection.createChannel()
    } catch (error) {
      throw new Error(`Couldn't connect to MQ host ${error.message}`)
    }
  }

  public async send (queue: string, data: Buffer) {
    if (!this.channel) {
      throw new Error('Channel has not been created')
    }
    return this.channel.sendToQueue(queue, data)
  }

  public async consume (queue: string, callback: (msg: Message | null) => void) {
    if (!this.channel) {
      throw new Error('Channel has not been created')
    }
    const assertedQueue = await this.channel.assertQueue(queue)
    this.channel.consume(assertedQueue.queue, callback)
  }
}
