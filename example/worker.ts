import { Worker } from '../src'
import { INPUT, MQ_HOST, MQ_PORT, OUTPUT, toUpperCase } from './simple'

const run = () => {
  const worker = new Worker(MQ_HOST, MQ_PORT, toUpperCase)

  worker.run(INPUT, OUTPUT)
}

run()
