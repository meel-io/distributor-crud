import * as zmq from 'zmq'
enum Mode {
  Push,
  Pull
}

const bindSocket = (mode: Mode, port: number) => {
  const socket = getSocket(mode).bindSync(`tcp://*:${port}`)

  return socket
}

const connectSocket = (mode: Mode, port: number) => {
  const socket = getSocket(mode).connect(`tcp://localhost:${port}`)

  return socket
}

const getSocket = (mode: Mode) => {
  return zmq.socket(mode)
}

export { bindSocket, connectSocket, Mode }
