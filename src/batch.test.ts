import { Batch } from './batch'

import * as chai from 'chai'
import * as mocha from 'mocha'

const assert = chai.assert
describe('Batch clear method', () => {
  const BATCH_SIZE = 5
  const batch = new Batch(BATCH_SIZE)

  it('should empty batch', () => {
    batch.clear()
    assert.isEmpty(batch.rows)
  })
})
