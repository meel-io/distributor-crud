import { Stream } from 'stream'
import { Dispatcher } from './dispatcher'

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'
import { MqAdapter } from './mqAdapter'

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

describe('Dispatcher run method', () => {
  const dispatcher = new Dispatcher(HOST, PORT, QUEUE)

  it("should throw an error when can't connect", () => {
    const connectStub = sandbox.stub(MqAdapter.prototype, 'connect')
    const stream = new Stream()

    connectStub.rejects('Connection error')

    assert.isRejected(Promise.resolve(dispatcher.run(stream)))
  })
})
