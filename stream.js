const { Readable } = require('readable-stream')
const Chance = require('chance')
const nameGenerator = new Chance()

const createStream = () => {
  const rs = Readable({
    read: () => {
      rs.push(Buffer.from(nameGenerator.name()))
    }
  })

  return rs
}

module.exports = { createStream }
