import { MqAdapter } from './mqAdapter'
import { Sink } from './sink'

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'

chai.use(chaiAsPromised)
const assert = chai.assert

const HOST = 'MQ_HOST'
const PORT = 5672
const QUEUE = 'QUEUE'
const CALLBACK = () => true

let sandbox

beforeEach(() => {
  sandbox = sinon.sandbox.create()
})

afterEach(() => {
  sandbox.restore()
})

describe('Sink run method', () => {
  const sink = new Sink(HOST, PORT, QUEUE)

  it("should throw an error when can't connect", () => {
    const connectStub = sandbox.stub(sink.mqAdapter, 'connect')
    const consumeStub = sandbox.stub(sink.mqAdapter, 'consume')

    const callback = sandbox.spy()

    connectStub.rejects('Connection error')
    consumeStub.withArgs(QUEUE, msg => callback(msg)).callsArg(1)

    assert.isRejected(Promise.resolve(sink.run(callback)))
    assert.isFalse(callback.called)
  })

  it('should run a callback when receiving a message from worker', () => {
    const connectStub = sandbox.stub(sink.mqAdapter, 'connect')
    const consumeStub = sandbox.stub(sink.mqAdapter, 'consume')

    const callback = sandbox.spy()

    connectStub.resolves()

    consumeStub
      .withArgs(QUEUE, msg => callback(msg))
      .callsArgWith(1, { content: Buffer.from('Hello') })

    assert.isFulfilled(Promise.resolve(sink.run(callback)))
  })
})
