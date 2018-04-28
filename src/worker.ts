import { Logger } from './logger'
import { getSocket, Mode } from './mqAdapter'

export class Worker {
  public job: (row: any[]) => void
  public logger: Logger

  /* istanbul ignore next */
  constructor(job: (row: any[]) => void, logger: Logger) {
    this.job = job
    this.logger = logger

    this.logger.info(`Work started at port`)
  }

  public async run(dispatcherPort: number, sinkPort: number) {
    const fromDispatcher = getSocket(Mode.Pull)
    const toSink = getSocket(Mode.Push)

    fromDispatcher.connect(`tcp://localhost:${dispatcherPort}`)
    toSink.connect(`tcp://localhost:${sinkPort}`)

    fromDispatcher.on('message', async (data: any) => {
      const { rows } = JSON.parse(data.toString())
      rows.map(async (row: any[]) => {
        await this.job(row)
        toSink.send(`row Processed`)
      })
    })
  }
}
