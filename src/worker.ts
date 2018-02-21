import { getSocket, Mode } from './mqAdapter'

const run = async (rowMethod: any, dispatcherPort: number, sinkPort: number) => {
  const fromDispatcher = getSocket(Mode.Pull)
  const toSink = getSocket(Mode.Push)

  fromDispatcher.connect(`tcp://localhost:${dispatcherPort}`)
  toSink.connect(`tcp://localhost:${sinkPort}`)

  fromDispatcher.on('message', async (data: any) => {
    const { rows } = JSON.parse(data.toString())
    rows.map(async (row: any[]) => {
      await rowMethod(row)
      toSink.send(`row Processed`)
    })
  })
}

export { run }
