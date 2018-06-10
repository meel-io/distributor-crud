import { MqAdapter } from './mqAdapter'
import { Worker } from './worker'

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'

chai.use(chaiAsPromised)
const assert = chai.assert

const HOST = 'MQ_HOST'
const PORT = 5672
const JOB = (row: string) => row
const DISPATCHER_QUEUE = 'DISPATCHER_QUEUE'
const SINK_QUEUE = 'SINK_QUEUE'

let sandbox

beforeEach(() => {
  sandbox = sinon.sandbox.create()
})

afterEach(() => {
  sandbox.restore()
})

describe('Worker run method', () => {
  const worker = new Worker(HOST, PORT, JOB)

  it("should throw an error when can't connect", () => {
    const connectStub = sandbox.stub(MqAdapter.prototype, 'connect')
    const consumeStub = sandbox.stub(MqAdapter.prototype, 'consume')

    const callback = sandbox.spy()

    connectStub.rejects('Connection error')
    consumeStub.withArgs(DISPATCHER_QUEUE, data => callback(data)).callsArg(1)

    assert.isRejected(Promise.resolve(worker.run(DISPATCHER_QUEUE, SINK_QUEUE)))
    assert.isFalse(callback.called)
  })

  it('should run a job when receiving a message from dispatcher', async () => {
    const connectStub = sandbox.stub(MqAdapter.prototype, 'connect')
    const consumeStub = sandbox.stub(MqAdapter.prototype, 'consume')
    const handleStub = sandbox.stub(Worker.prototype, 'handle')

    connectStub.resolves()
    consumeStub.callsArgWith(1, SINK_QUEUE, { content: Buffer.from('Hello') })

    await worker.run(DISPATCHER_QUEUE, SINK_QUEUE)
    assert.isTrue(handleStub.called)
  })
})
