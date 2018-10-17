import { fork } from 'child_process'
import * as pino from 'pino'
import { Readable } from 'stream'

const logger = pino()
const WORKERS = 3

const generateWorkers = (numberOfWorkers: number) =>
  Array.from({ length: numberOfWorkers }, () => fork('example/worker'))

const workers = generateWorkers(WORKERS)
const dispatcher = fork('example/dispatcher')
const sink = fork('example/sink')

dispatcher.send('start')
sink.send('start')
workers.forEach(worker => worker.send('start'))

dispatcher.on('message', msg => {
  logger.info(msg)
})
sink.on('message', msg => {
  logger.info(msg)
})
workers.forEach(worker =>
  worker.on('message', msg => {
    logger.info(msg)
  })
)
