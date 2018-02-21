import { Stream } from 'stream'
import { Logger } from './logger'
import { bindSocket, Mode } from './mqAdapter'

const run = (stream: Stream, port: number, batchSize: number = 10, logger: Logger) => {
  const dispatcher = bindSocket(Mode.Push, port)
  let batch: any[] = []

  stream
    .on('data', row => {
      batch.push(row)
      if (batch.length === batchSize) {
        dispatcher.send(JSON.stringify({ rows: batch }))
        batch = []
      }
    })
    .on('end', () => {
      dispatcher.send(JSON.stringify({ rows: batch }))
    })

  dispatcher.on('accept', () => {
    logger.info('Worker accepted')
  })

  logger.info(`Dispatcher started at port: ${port}`)
}

export { run }
