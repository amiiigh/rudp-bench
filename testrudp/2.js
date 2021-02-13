
let dgram = require('dgram')
let rudp = require('./rudp')


const SERVER_PORT = 8124
const KEY = 'Z7Dga2kTwErRuLVb7va_RAyVdXTWMHVbRBEEVtwl4YU='
let _connections = {}

const createEncryptedConnection = function (address, port, sessionKey) {
  let connection
  let addressKey = address + ':' + port  + SERVER_PORT
  console.log('creating encrypted connection', addressKey)
  connection = new rudp.Connection(new rudp.PacketSender(server, address, port, sessionKey))
  connection.on('close', () => {
    console.log('connection close event received')
  })
  connection.on('data', (data) => {
   console.log('got', data.toString())
   connection.send(Buffer.from('I got your message'))
  })
  _connections[addressKey] = connection 
  console.log('connections:', Object.keys(_connections))
}

const getConnection = function (address, port) {
  let connection
  let addressKey = address + ':' + port + SERVER_PORT
  connection = _connections[addressKey]
  return connection
}


let server = dgram.createSocket('udp4')
server.bind({
  port: SERVER_PORT,
  exclusive: false
})

server.on('message', async (message, remoteInfo) => {
  if (message.length < 12) {
    console.log('DUMMY')
    return
  }
  console.log(remoteInfo)
  let connection = getConnection(remoteInfo.address, remoteInfo.port)
  setImmediate(() => {
    connection.receive(message)
  })
})

createEncryptedConnection('76.23.247.114', 8123, KEY)