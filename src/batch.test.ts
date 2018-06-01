import { Batch } from './batch'

import * as chai from 'chai'
import * as mocha from 'mocha'

const assert = chai.assert
const BATCH_SIZE = 5

describe('Batch clear method', () => {
  const batch = new Batch(BATCH_SIZE)

  it('should empty batch', () => {
    batch.push(Buffer.from('hello world'))
    batch.clear()
    assert.isEmpty(batch.rows)
  })
})

describe('Batch full method', () => {
  const batch = new Batch(BATCH_SIZE)

  it('should return false if not full', () => {
    batch.push(Buffer.from("There's a starman waiting in the sky"))
    assert.isFalse(batch.full())
  })

  it('should return true if full', () => {
    batch.push(Buffer.from("He'd like to come and meet us"))
    batch.push(Buffer.from("But he thinks he'd blow our minds"))
    batch.push(Buffer.from("There's a starman waiting in the sky"))
    batch.push(Buffer.from("He's told us not to blow it"))
    assert.isTrue(batch.full())
  })
})

describe('Batch push method', () => {
  const batch = new Batch(BATCH_SIZE)

  it('should add to collection if not full', () => {
    batch.push(Buffer.from("There's a starman waiting in the sky"))
    assert.lengthOf(batch.rows, 1)
  })

  it('should not add to collection if full', () => {
    batch.push(Buffer.from("He'd like to come and meet us"))
    batch.push(Buffer.from("But he thinks he'd blow our minds"))
    batch.push(Buffer.from("There's a starman waiting in the sky"))
    batch.push(Buffer.from("He's told us not to blow it"))
    batch.push(Buffer.from("Cause he knows it's all worthwhile"))
    assert.lengthOf(batch.rows, 5)
  })
})
