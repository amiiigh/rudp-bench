var net = require('net');
var fs = require('fs')
var client = new net.Socket();
var data = fs.readFileSync('data.pdf');
console.log('file is ready to send')
console.log(data.length)

client.connect(13223, '128.119.245.46', function() {
	console.log('Connected');
	client.write(data);
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});