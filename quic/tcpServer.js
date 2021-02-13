var net = require('net');
var fs = require('fs')

var server = net.createServer(function(socket) {
	socket.on('data', (data) => {
		fs.appendFileSync('received', data)
		console.log(fs.statSync('received')['size'])
	})
});

server.listen(13223, '0.0.0.0');