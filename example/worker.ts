import { Worker } from '../src'
import { INPUT, MQ_HOST, MQ_PORT, OUTPUT, toUpperCase } from './'

const run = () => {
  const worker = new Worker(MQ_HOST, MQ_PORT, toUpperCase)

  worker.run(INPUT, OUTPUT)
}

process.on('message', () => {
  run()
  process.send(`Worker: ${process.pid} started`)
})
