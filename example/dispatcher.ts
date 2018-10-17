import { Readable } from 'stream'

import { Dispatcher } from '../src'
import { INPUT, MQ_HOST, MQ_PORT } from './'

const run = async () => {
  const dispatcher = new Dispatcher(MQ_HOST, MQ_PORT, INPUT)

  const duplex = await dispatcher.run()
}

process.on('message', () => {
  run()
  process.send(`Dispatcher: ${process.pid} started`)
})
