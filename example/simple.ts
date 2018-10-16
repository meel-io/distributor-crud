import { fork } from 'child_process'
const WORKERS = 3

const generateWorkers = (numberOfWorkers: number) =>
  Array.from({ length: numberOfWorkers }, () => fork('./worker'))

const workers = generateWorkers(WORKERS)
const dispatcher = fork('./dispatcher')
const sink = fork('./sink')

dispatcher.send('start')
sink.send('start')
workers.forEach(worker => worker.send('start'))
