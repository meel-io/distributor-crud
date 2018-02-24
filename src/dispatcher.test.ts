import * as sinon from 'sinon'
import { Batch, Dispatcher } from './dispatcher'
import { Logger } from './logger'
import * as mqAdapter from './mqAdapter'

const batchSize = 5
const port = 5016
const row = {
  prop1: 'value1',
  prop2: 'value2'
}

describe('Test dispatcher', () => {
  describe('Test process', () => {
    const BatchPrototype: Batch = Batch.prototype
    const DispatcherPrototype: Dispatcher = Dispatcher.prototype
    const LoggerPrototype: Logger = Logger.prototype

    beforeEach(() => {
      sinon.stub(Batch.prototype, 'push')
      sinon.stub(Batch.prototype, 'full')
      sinon.stub(Batch.prototype, 'clear')
      sinon.stub(Dispatcher.prototype, 'send')
      sinon.stub(Logger.prototype, 'info')
      sinon.stub(mqAdapter, 'bindSocket')
    })

    afterEach(() => {
      const full = BatchPrototype.push as sinon.SinonStub
      const push = BatchPrototype.full as sinon.SinonStub
      const clear = BatchPrototype.clear as sinon.SinonStub
      const send = DispatcherPrototype.send as sinon.SinonStub
      const info = LoggerPrototype.info as sinon.SinonStub
      const bindSocket = mqAdapter.bindSocket as sinon.SinonStub
      full.restore()
      push.restore()
      clear.restore()
      send.restore()
      info.restore()
      bindSocket.restore()
    })

    it('should not send if batch is not full', () => {
      const full = BatchPrototype.full as sinon.SinonStub
      const push = BatchPrototype.push as sinon.SinonStub
      const clear = BatchPrototype.clear as sinon.SinonStub
      const send = DispatcherPrototype.send as sinon.SinonStub
      full.returns(false)
      push.withArgs(row)

      const batch = new Batch(batchSize)
      const logger = new Logger()

      const dispatcher = new Dispatcher(port, batchSize, logger)
      dispatcher.process(row)

      sinon.assert.calledOnce(push)
      sinon.assert.calledOnce(full)
      sinon.assert.notCalled(clear)
      sinon.assert.notCalled(send)
    })
  })
})
