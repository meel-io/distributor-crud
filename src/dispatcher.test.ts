import { Dispatcher } from './dispatcher'

import { Duplex } from 'stream'

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'
import { MqAdapter } from './mqAdapter'

chai.use(chaiAsPromised)
const assert = chai.assert

const HOST = 'MQ_HOST'
const PORT = 5672
const QUEUE = 'QUEUE'
const ROWS = [
  "There's a starman waiting in the sky",
  "He'd like to come and meet us",
  "But he thinks he'd blow our minds",
  "There's a starman waiting in the sky",
  "He's told us not to blow it",
  "There's a starman waiting in the sky",
  "He'd like to come and meet us",
  "But he thinks he'd blow our minds",
  "There's a starman waiting in the sky",
  "He's told us not to blow it",
  "There's a starman waiting in the sky"
]

let sandbox

beforeEach(() => {
  sandbox = sinon.sandbox.create()
})

afterEach(() => {
  sandbox.restore()
})

describe('Dispatcher run method', () => {
  const dispatcher = new Dispatcher(HOST, PORT, QUEUE)

  it("should throw an error when can't connect", () => {
    const connectStub = sandbox.stub(MqAdapter.prototype, 'connect')

    connectStub.rejects('Connection error')

    assert.isRejected(Promise.resolve(dispatcher.run()))
  })

  it('should return a writable stream when can connect', () => {
    const connectStub = sandbox.stub(MqAdapter.prototype, 'connect')

    connectStub.resolves()

    assert.eventually.instanceOf(dispatcher.run(), Duplex)
  })

  it("should send a batch when it's full", async () => {
    const connectStub = sandbox.stub(MqAdapter.prototype, 'connect')
    const sinkSpy = sandbox.stub(MqAdapter.prototype, 'send')

    connectStub.resolves()

    const dispatcherStream = await dispatcher.run()

    ROWS.reduce((result, row) => {
      dispatcherStream.write(row)

      return result
    }, true)

    assert.isTrue(sinkSpy.called)
  })
})
