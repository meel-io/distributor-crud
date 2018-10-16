import { Dispatcher } from '../src'
import { INPUT, MQ_HOST, MQ_PORT } from './'

const run = () => {
  const dispatcher = new Dispatcher(MQ_HOST, MQ_PORT, INPUT)

  dispatcher.run()
}

process.on('message', () => {
  run()
  process.send(`Dispatcher: ${process.pid} started`)
})
