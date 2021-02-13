let config = require('../config')
let dgram = require('dgram')
let rudp = require('../rudp')
let fs = require('fs')
let file = fs.readFileSync(config.TEST_FILE)
const fileSize = file.length

const SERVER_PORT = 8123
const SERVER_ADDRESS = '127.0.0.1'

const LOCAL_PORT = 8124
const KEY = 'Z7Dga2kTwErRuLVb7va_RAyVdXTWMHVbRBEEVtwl4YU='
let _connections = {}
let total = 0

let start
let finish
let receiving = false

const createEncryptedConnection = function (address, port, sessionKey) {
  let connection
  let addressKey = address + ':' + port  + LOCAL_PORT
  console.log('creating encrypted connection', addressKey)
  connection = new rudp.Connection(new rudp.PacketSender(server, address, port, sessionKey))
  connection.on('close', () => {
    console.log('connection close event received')
  })
  connection.on('data', (data) => {
    if (receiving === false) {
      receiving = true
      start = new Date()
    }
    total += data.length
    if (total === fileSize) {
      console.log('File received!', total)
      finish = new Date() - start
      console.log('Execution time: %dms', finish)
    }
  })
  _connections[addressKey] = connection 
  console.log('connections:', Object.keys(_connections))
}

const getConnection = function (address, port) {
  let connection
  let addressKey = address + ':' + port + LOCAL_PORT
  connection = _connections[addressKey]
  return connection
}


let server = dgram.createSocket('udp4')
server.bind({
  port: LOCAL_PORT,
  exclusive: false
})

server.on('message', async (message, remoteInfo) => {
  if (message.length < 12) {
    console.log('DUMMY')
    return
  }
  let connection = getConnection(remoteInfo.address, remoteInfo.port)
  setImmediate(() => {
    connection.receive(message)
  })
})

createEncryptedConnection(SERVER_ADDRESS, SERVER_PORT, KEY)
let connection = getConnection(SERVER_ADDRESS, SERVER_PORT)
connection.send(Buffer.from('HELLO'))
// let a = setInterval(() => {
//   connection.send(Buffer.from('hello'))
// }, 1000);