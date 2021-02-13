let config = require('../config')
let dgram = require('dgram')
let rudp = require('../rudp')
var fs = require('fs')

const LOCAL_PORT = 8123
const CLIENT_ADDRESS = '127.0.0.1'
const CLIENT_PORT = 8124
const KEY = 'Z7Dga2kTwErRuLVb7va_RAyVdXTWMHVbRBEEVtwl4YU='
let _connections = {}


const sendFile = function (connection) {
  let file = fs.readFileSync(config.TEST_FILE)
  console.log(config.TEST_FILE, ' is ready to send!')
  connection.send(file)
}


const createEncryptedConnection = function (address, port, sessionKey) {
  let connection
  let addressKey = address + ':' + port  + LOCAL_PORT
  console.log('creating encrypted connection', addressKey)
  connection = new rudp.Connection(new rudp.PacketSender(server, address, port, sessionKey))
  connection.on('close', () => {
    console.log('connection close event received')
  })
  connection.on('data', (data) => {
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

console.log('UDP server started on port 8123')

createEncryptedConnection(CLIENT_ADDRESS, CLIENT_PORT, KEY)

let connection = getConnection(CLIENT_ADDRESS, CLIENT_PORT)
connection.on('connect', () => {
  sendFile(connection)
})

connection.on('sent', () => {
  console.log('sent')
}) 

// let a = setInterval(() => {
//   connection.send(Buffer.from('hello'))
// }, 1000);