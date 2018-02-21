import {} from 'mocha'
import * as sinon from 'sinon'
import * as mq from './mqAdapter'
import { Stream } from 'stream'
import { run } from './dispatcher'

const dispatcherSocket = {
  on: sinon.spy(),
  send: sinon.spy()
}

const bindSocket = sinon.stub(mq, 'bindSocket')
const stream: Stream = new Stream()

bindSocket.returns(dispatcherSocket)

const port = 5016
const batchSize = 10

describe('Test dispatcher', function() {
  describe('Test run', function() {
    it('should ', function() {
      run(stream, port, batchSize)
      bindSocket.restore()
    })
  })
})
