import * as pino from 'pino'
import { Readable } from 'stream'
import { Dispatcher } from '../src'
import { INPUT, MQ_HOST, MQ_PORT } from './'

const logger = pino()

const getStream = (counter: number) => {
  const input = new Readable({
    read () {
      this.push('foobar')
      if (counter-- === 0) {
        this.push(null)
      }
    }
  })

  return input
}

const run = async () => {
  const dispatcher = new Dispatcher(MQ_HOST, MQ_PORT, INPUT)

  await dispatcher.run()

  return dispatcher.getStream()
}

process.on('message', async () => {
  logger.info(`Starting process: ${process.pid}`)
  const duplex = await run()
  const input = getStream(20)

  input.pipe(duplex)
})
