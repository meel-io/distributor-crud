const zmq = require('zmq')
const mode = {
  push: 'push',
  pull: 'pull'
}

const bindSocket = (mode, port) => {
  const socket = getSocket(mode).bindSync(`tcp://*:${port}`)

  return socket
}

const connectSocket = (mode, port) => {
  const socket = getSocket(mode).connect(`tcp://localhost:${port}`)

  return socket
}

const getSocket = mode => {
  return zmq.socket(mode)
}

module.exports = { bindSocket, connectSocket, mode }
