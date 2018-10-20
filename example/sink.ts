import * as pino from 'pino'

import { Sink } from '../src'
import { INPUT, MQ_HOST, MQ_PORT } from './'

const logger = pino()

const run = () => {
  const sink = new Sink(MQ_HOST, MQ_PORT, INPUT)

  sink.run((msg: any) => msg)
}

process.on('message', async () => {
  logger.info(`Starting process: ${process.pid}`)
  await run()
})
