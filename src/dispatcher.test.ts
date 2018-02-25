import * as sinon from 'sinon'
import { Stream } from 'stream'
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
  const BatchPrototype: Batch = Batch.prototype
  const LoggerPrototype: Logger = Logger.prototype

  beforeEach(() => {
    sinon.stub(Batch.prototype, 'push')
    sinon.stub(Batch.prototype, 'full')
    sinon.stub(Batch.prototype, 'clear')
    sinon.stub(Logger.prototype, 'info')
  })

  afterEach(() => {
    const full = BatchPrototype.push as sinon.SinonStub
    const push = BatchPrototype.full as sinon.SinonStub
    const clear = BatchPrototype.clear as sinon.SinonStub
    const info = LoggerPrototype.info as sinon.SinonStub
    full.restore()
    push.restore()
    clear.restore()
    info.restore()
  })

  describe('Test process', () => {
    const DispatcherPrototype: Dispatcher = Dispatcher.prototype

    beforeEach(() => {
      sinon.stub(Dispatcher.prototype, 'send')
      sinon.stub(mqAdapter, 'bindSocket')
    })

    afterEach(() => {
      const send = DispatcherPrototype.send as sinon.SinonStub
      const bindSocket = mqAdapter.bindSocket as sinon.SinonStub
      send.restore()
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

    it('should send if batch is full', () => {
      const full = BatchPrototype.full as sinon.SinonStub
      const push = BatchPrototype.push as sinon.SinonStub
      const clear = BatchPrototype.clear as sinon.SinonStub
      const send = DispatcherPrototype.send as sinon.SinonStub
      full.returns(true)
      push.withArgs(row)

      const batch = new Batch(batchSize)
      const logger = new Logger()

      const dispatcher = new Dispatcher(port, batchSize, logger)
      dispatcher.process(row)

      sinon.assert.calledOnce(push)
      sinon.assert.calledOnce(full)
      sinon.assert.calledOnce(clear)
      sinon.assert.calledOnce(send)
    })
  })
  describe('Test run', async () => {
    const DispatcherPrototype: Dispatcher = Dispatcher.prototype

    beforeEach(() => {
      sinon.stub(Dispatcher.prototype, 'process')
      sinon.stub(Dispatcher.prototype, 'send')
      sinon.stub(mqAdapter, 'bindSocket')
    })

    afterEach(() => {
      const process = DispatcherPrototype.process as sinon.SinonStub
      const send = DispatcherPrototype.send as sinon.SinonStub
      const bindSocket = mqAdapter.bindSocket as sinon.SinonStub
      process.restore()
      send.restore()
      bindSocket.restore()
    })

    it('should attach listeners', () => {
      const send = DispatcherPrototype.send as sinon.SinonStub
      const process = DispatcherPrototype.process as sinon.SinonStub
      const bindSocket = mqAdapter.bindSocket as sinon.SinonStub
      const batch = new Batch(batchSize)
      const logger = new Logger()
      const streamStub: Partial<Stream> = {
        on: sinon.stub()
      }

      const socket = { on: sinon.stub() }
      bindSocket.returns(socket)

      const dispatcher = new Dispatcher(port, batchSize, logger)
      const stream = streamStub as Stream
      dispatcher.run(stream)

      sinon.assert.calledWith(stream.on as sinon.SinonStub, 'data', process)
      sinon.assert.calledWith(stream.on as sinon.SinonStub, 'end', send)
      sinon.assert.calledWith(socket.on as sinon.SinonStub, 'accept')
    })
  })
})
