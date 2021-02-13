const net = require('net');
const config = require('../config');
const client = new net.Socket();
const port = config.TCP_SERVER_PORT;
const host = config.TCP_SERVER_ADDRESS;
let startTime;
let endTime;
let receiving = false;

client.connect(port, host, function() {
    console.log('Connected');
    client.write("Hello From Client " + client.address().address);
});

client.on('data', function(data) {
    if (!receiving) {
    	startTime = new Date();
    	console.log('Receiving the file ...')
    	receiving = true
    }
});

client.on('close', function() {
    console.log('Connection closed');
});

client.on('end', () => {
	console.log('Done receiving the file!')
	endTime = new Date() - startTime;
	console.log('Execution time: %dms', endTime);
})