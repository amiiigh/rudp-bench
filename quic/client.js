var quic = require('node-quic')
var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'graph.pdf');

var data = fs.readFileSync(filePath);
console.log('file is ready to send')
console.log(data.length)

const port    = 13334
const address = '128.119.245.46'

function sendData() {
	quic.send(port, address, data)
	  .onData(data => {
	 
	    // This is the data that was sent right back
	    const parsedData = JSON.parse(data)
	    console.log(parsedData) // { hello: 'world!' }
	 
	    // now we can stop the server from listening if we want this to be a one-off
	    quic.stopListening()
	  })
}

setInterval(sendData, 2000)