import * as sinon from 'sinon'
import { Stream } from 'stream'
import { run } from './dispatcher'
import { Logger } from './logger'
import * as mq from './mqAdapter'

const dispatcherSocket = {
  on: sinon.spy(),
  send: sinon.spy()
}

const bindSocket = sinon.stub(mq, 'bindSocket')
const stream: Stream = new Stream()

bindSocket.returns(dispatcherSocket)

const logger = new Logger()
const info = sinon.stub(logger, 'info')

const port = 5016
const batchSize = 10

describe('Test dispatcher', () => {
  describe('Test run', () => {
    it('should ', () => {
      run(stream, port, batchSize, logger)
      bindSocket.restore()
    })
  })
})
