require('dotenv').config()
const zmq = require('zmq')
const schema = require('sb-schema')

const { DBHOST, DBPORT, DBNAME, DBUSERNAME, DBPASSWORD } = process.env
schema.connect({
  type: 'postgres',
  username: DBUSERNAME,
  password: DBPASSWORD,
  host: DBHOST,
  port: DBPORT,
  name: DBNAME
})

const getPlayerRepository = schema.getPlayerRepository()
const fromDispatcher = zmq.socket('pull')
const toSink = zmq.socket('push')

const dispatcherPort = process.env.DISPATCHER_PORT || 5016
const sinkPort = process.env.SINK_PORT || 5017

fromDispatcher.connect(`tcp://localhost:${dispatcherPort}`)
toSink.connect(`tcp://localhost:${sinkPort}`)

fromDispatcher.on('message', async buffer => {
  const { firstname, lastname } = JSON.parse(buffer)
  const user = await getPlayerRepository.create({ firstname, lastname })
  toSink.send(`Inserted: ${user.id}`)
})
