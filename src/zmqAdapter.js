const zmq = require('zmq')

const socket = mode => {
  return zmq(mode)
}

module.exports = { socket }
