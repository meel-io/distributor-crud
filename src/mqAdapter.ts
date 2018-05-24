import { Channel, connect } from 'amqplib'

export class MqAdapter {
  public mqHost: string
  public mqPort: number

  constructor(mqHost: string, mqPort: number = 5672) {
    this.mqHost = mqHost
    this.mqPort = mqPort
  }

  public async connect() {
    const connection = await connect(`amqp://${this.mqHost}`)
    return connection.createChannel()
  }
}
