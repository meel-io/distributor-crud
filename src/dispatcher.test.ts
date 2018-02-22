import * as sinon from 'sinon'
import { Dispatcher, Batch } from './dispatcher'
import { Logger } from './logger'

const batchSize = 5
const port = 5000

describe('Test dispatcher', () => {
  describe('Test process', () => {
    it('should not send if batch is not full', () => {
      const batch = new Batch(batchSize)
      const push = sinon.stub(batch, 'push')
      const full = sinon.stub(batch, 'full')

      full.returns(false)

      const logger = new Logger()
      const info = sinon.stub(logger, 'info')

      const dispatcher = new Dispatcher(port, batchSize, logger)

      dispatcher.process({})
    })
    it('should not send and clear if batch is full', () => {})
  })
  describe('Test run', () => {
    it('should attach listeners to data, end, accept', () => {})
  })
})

describe('Test batch', () => {
  describe('Test push', () => {})
  describe('Test clear', () => {})
  describe('Test full', () => {})
})
