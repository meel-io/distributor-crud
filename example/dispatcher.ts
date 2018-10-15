import { Dispatcher } from '../src'
import { INPUT, MQ_HOST, MQ_PORT } from './simple'

const run = () => {
  const dispatcher = new Dispatcher(MQ_HOST, MQ_PORT, INPUT)

  dispatcher.run()
}

run()
