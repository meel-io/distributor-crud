import { Channel, connect, Message } from 'amqplib'

export class MqAdapter {
  public mqHost: string
  public mqPort: number
  private channel!: Channel

  constructor(mqHost: string, mqPort: number = 5672) {
    this.mqHost = mqHost
    this.mqPort = mqPort
  }

  public async connect() {
    try {
      const connection = await connect(`amqp://${this.mqHost}`)
      this.channel = await connection.createChannel()
    } catch (error) {
      throw new Error(`Error: Couldn't connect to MQ host ${error.message}`)
    }
  }

  public send(queue: string, data: Buffer) {
    return this.channel.sendToQueue(queue, data)
  }

  public async consume(queue: string, callback: (msg: Message | null) => void) {
    const assertedQueue = await this.channel.assertQueue(queue)
    this.channel.consume(assertedQueue.queue, callback)
  }
}
