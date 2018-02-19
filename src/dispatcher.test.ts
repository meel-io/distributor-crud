import {} from 'mocha'
import * as sinon from 'sinon'
import * as mq from './mqAdapter'

const stub = sinon.stub(mq, 'bindSocket')

const dispatcher = require('./dispatcher')
const port = 5016

describe('Test dispatcher', function() {
  describe('Test run', function() {
    it('should ', function() {})
  })
})
