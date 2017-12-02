const zmq = require('zmq')
const fromDispatcher = zmq.socket('pull')
const toSink = zmq.socket('push')

const dispatcherPort = process.env.DISPATCHER_PORT || 5016
const sinkPort = process.env.SINK_PORT || 5017

fromDispatcher.connect(`tcp://localhost:${dispatcherPort}`)
toSink.connect(`tcp://localhost:${sinkPort}`)

fromDispatcher.on('message', buffer => {
  const msg = JSON.parse(buffer)
  insertOperationHere(msg)
})

const insertOperationHere = ({ rows }) => {
  // ToDo: Change this for a CRUD op
}
