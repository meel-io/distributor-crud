import { Message, MqAdapter } from './mqAdapter'

export class Sink {
  public mqAdapter: MqAdapter
  public queue: string

  /* istanbul ignore next */
  constructor(mqHost: string, mqPort: number, queue: string) {
    this.mqAdapter = new MqAdapter(mqHost, mqPort)
    this.queue = queue
  }

  public async run(callback: (msg: Message | null) => void) {
    try {
      await this.mqAdapter.connect()
      this.mqAdapter.consume(this.queue, msg => {
        if (msg) {
          callback(msg)
        }
      })
    } catch (error) {
      throw error
    }
  }
}
