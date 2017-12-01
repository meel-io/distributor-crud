const zmq = require('zmq')
const fromDispatcher = zmq.socket('pull')
const toSink = zmq.socket('push')

fromDispatcher.connect('tcp://localhost:5016')
toSink.connect('tcp://localhost:5017')

fromDispatcher.on('message', buffer => {
  const msg = JSON.parse(buffer)
  console.log(msg)
})
