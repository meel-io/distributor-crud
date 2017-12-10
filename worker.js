require('dotenv').config()
const chalk = require('chalk')
const zmq = require('zmq')
const { connect, Player } = require('sb-schema')

const run = async () => {
  const { DBHOST, DBPORT, DBNAME, DBUSERNAME, DBPASSWORD } = process.env
  const connection = await connect({
    type: 'postgres',
    host: DBHOST,
    port: DBPORT,
    database: DBNAME,
    username: DBUSERNAME,
    password: DBPASSWORD
  }).catch(error => {
    throw error
  })

  const getPlayerRepository = connection.getRepository(Player)
  const fromDispatcher = zmq.socket('pull')
  const toSink = zmq.socket('push')

  const dispatcherPort = process.env.DISPATCHER_PORT || 5016
  const sinkPort = process.env.SINK_PORT || 5017

  fromDispatcher.connect(`tcp://localhost:${dispatcherPort}`)
  toSink.connect(`tcp://localhost:${sinkPort}`)

  fromDispatcher.on('message', async data => {
    const { rows } = JSON.parse(data.toString())
    rows.map(async row => {
      /** ToDo: Parse nested buffer */
      const { firstname, lastname } = JSON.parse(Buffer.from(row).toString())
      const player = getPlayerRepository.create({ firstname, lastname })
      await getPlayerRepository.save(player).catch(error => {
        throw error
      })
      console.log(chalk.greenBright(`Succesfully inserted: ${player.firstname} ${player.lastname}`))
      toSink.send(`Inserted: ${player.id}`)
    })
  })
}

run()
