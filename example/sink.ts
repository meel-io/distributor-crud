import { Sink } from '../src'
import { INPUT, MQ_HOST, MQ_PORT } from './simple'

const run = () => {
  const sink = new Sink(MQ_HOST, MQ_PORT, INPUT)

  sink.run((msg: any) => msg)
}

run()
