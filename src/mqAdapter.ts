import { socket, Socket } from 'zmq'
enum Mode {
  Push = 'push',
  Pull = 'pull'
}

const bindSocket = (mode: Mode, port: number) => {
  return getSocket(mode).bindSync(`tcp://*:${port}`)
}

const connectSocket = (mode: Mode, port: number) => {
  return getSocket(mode).connect(`tcp://localhost:${port}`)
}

const getSocket = (mode: Mode) => {
  return socket(mode)
}

export { bindSocket, connectSocket, getSocket, Mode, Socket }
