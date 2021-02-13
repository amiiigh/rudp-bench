var net = require('net');
var fs = require('fs')
var config = require('../config')
var client = new net.Socket();
var file = fs.readFileSync(config.TEST_FILE);


const port = config.TCP_SERVER_PORT;
const server = net.createServer();
server.listen(port, () => {
    console.log('TCP Server is running on port ' + port +'.');
});

let sockets = [];

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function(data) {
    	sock.write(file)
    	sock.destroy()
    });
});