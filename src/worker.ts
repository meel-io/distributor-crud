const zmq = require('zmq')

const run = async (rowMethod: Function, dispatcherPort: number, sinkPort: number) => {
  const fromDispatcher = zmq.socket('pull')
  const toSink = zmq.socket('push')

  fromDispatcher.connect(`tcp://localhost:${dispatcherPort}`)
  toSink.connect(`tcp://localhost:${sinkPort}`)

  fromDispatcher.on('message', async (data: Object) => {
    const { rows } = JSON.parse(data.toString())
    rows.map(async (row: any[]) => {
      await rowMethod(row)
      toSink.send(`row Processed`)
    })
  })
}

export { run }
