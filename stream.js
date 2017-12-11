const { Readable } = require('readable-stream')
const faker = require('faker')

const createStream = numberOfOps => {
  const rs = Readable({
    read: () => {
      rs.push(
        Buffer.from(
          JSON.stringify({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName()
          })
        )
      )
      if (--numberOfOps <= 0) {
        rs.push(null)
      }
    }
  })

  return rs
}

module.exports = { createStream }
