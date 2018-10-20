import { ChildProcess, fork } from 'child_process'
import * as pino from 'pino'

const logger = pino()
const WORKERS = 3

const generateWorkers = (numberOfWorkers: number) =>
  Array.from({ length: numberOfWorkers }, () => fork('example/worker'))

const workers = generateWorkers(WORKERS)
const dispatcher = fork('example/dispatcher')
const sink = fork('example/sink')

const attachListeners = (child: ChildProcess) => {
  child.on('message', msg => {
    logger.info(msg)
  })
  child.send('start')
}

const children = [sink, dispatcher, ...workers]
children.forEach(child => attachListeners(child))
