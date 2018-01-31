const zmq = require('zmq')

const run = async (rowMethod, dispatcherPort, sinkPort) => {
  const fromDispatcher = zmq.socket('pull')
  const toSink = zmq.socket('push')

  fromDispatcher.connect(`tcp://localhost:${dispatcherPort}`)
  toSink.connect(`tcp://localhost:${sinkPort}`)

  fromDispatcher.on('message', async data => {
    const { rows } = JSON.parse(data.toString())
    rows.map(async row => {
      await rowMethod(row)
      toSink.send(`row Processed`)
    })
  })
}

module.exports = { run }
