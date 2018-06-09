import { MqAdapter } from './mqAdapter'

import * as amqplib from 'amqplib'

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'

const HOST = 'MQ_HOST'
const PORT = 5672
const QUEUE = 'QUEUE'
const DATA = Buffer.from('Hello World')
const CALLBACK = () => true

chai.use(chaiAsPromised)
const assert = chai.assert

let sandbox

beforeEach(() => {
  sandbox = sinon.sandbox.create()
})

afterEach(() => {
  sandbox.restore()
})

describe('MqAdapter connect method', () => {
  const mqAdapter = new MqAdapter(HOST, PORT)

  it("should throw an error when can't connect", () => {
    const connectStub = sandbox.stub(amqplib, 'connect')
    connectStub.rejects('Connection error')

    assert.isRejected(Promise.resolve(mqAdapter.connect()))
  })

  it('should set a channel when can connect', () => {
    const connectStub = sandbox.stub(amqplib, 'connect')
    const createChannel = sandbox.stub()
    createChannel.resolves('Connection established')
    connectStub.resolves({ createChannel })

    assert.isFulfilled(Promise.resolve(mqAdapter.connect()))
  })
})

describe('MqAdapter send method', () => {
  const mqAdapter = new MqAdapter(HOST, PORT)

  it('should throw when no channel available', () => {
    assert.isRejected(Promise.resolve(mqAdapter.send(QUEUE, DATA)))
  })

  it('should send a message to a queue', async () => {
    const connectStub = sandbox.stub(amqplib, 'connect')
    const createChannel = sandbox.stub()
    const sendToQueue = sandbox.stub()
    sendToQueue.withArgs(QUEUE, DATA).resolves('Message sent')
    createChannel.resolves({ sendToQueue })
    connectStub.resolves({ createChannel })

    await mqAdapter.connect()

    assert.isFulfilled(Promise.resolve(mqAdapter.send(QUEUE, DATA)))
  })
})

describe('MqAdapter consume method', () => {
  const mqAdapter = new MqAdapter(HOST, PORT)

  it('should throw when no channel available', () => {
    assert.isRejected(Promise.resolve(mqAdapter.consume(QUEUE, CALLBACK)))
  })

  it('should run a callback when a message is received', async () => {
    const connectStub = sandbox.stub(amqplib, 'connect')
    const createChannel = sandbox.stub()
    const consume = sandbox.stub()
    const assertQueue = sandbox.stub()
    const queue = sandbox.stub()

    queue.returns(QUEUE)
    assertQueue.withArgs(QUEUE).resolves({ queue })
    consume.withArgs(QUEUE, CALLBACK).resolves('Message sent')

    createChannel.resolves({ assertQueue, consume })
    connectStub.resolves({ createChannel })

    await mqAdapter.connect()

    assert.isFulfilled(Promise.resolve(mqAdapter.consume(QUEUE, CALLBACK)))
  })
})
