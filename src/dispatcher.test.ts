import * as sinon from 'sinon'
import { Batch, Dispatcher } from './dispatcher'
import { Logger } from './logger'

const batchSize = 5
const port = 5000
const row = {
  prop1: 'value1',
  prop2: 'value2'
}

describe('Test dispatcher', () => {
  describe('Test process', () => {
    it('should not send if batch is not full', () => {
      const push = sinon.stub(Batch.prototype, 'push').withArgs(row)
      const full = sinon.stub(Batch.prototype, 'full').returns(false)
      const clear = sinon.spy(Batch.prototype, 'clear')
      const batch = new Batch(batchSize)

      full.returns(false)

      const logger = new Logger()
      const info = sinon.stub(logger, 'info')

      const send = sinon.stub(Dispatcher.prototype, 'send')
      const dispatcher = new Dispatcher(port, batchSize, logger)

      dispatcher.process(row)

      sinon.assert.calledOnce(push)
      sinon.assert.calledOnce(full)
      sinon.assert.notCalled(clear)
      sinon.assert.notCalled(send)

      push.resetBehavior()
      full.resetBehavior()
      send.resetBehavior()
      info.resetBehavior()
    })
  })
})
