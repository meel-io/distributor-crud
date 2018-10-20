import * as pino from 'pino'
import { Worker } from '../src'
import { INPUT, MQ_HOST, MQ_PORT, OUTPUT, toUpperCase } from './'

const logger = pino()

const run = () => {
  const worker = new Worker(MQ_HOST, MQ_PORT, toUpperCase)

  worker.run(INPUT, OUTPUT)
}

process.on('message', async () => {
  logger.info(`Starting process: ${process.pid}`)
  await run()
})
