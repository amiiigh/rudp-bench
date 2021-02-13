var quic = require('node-quic')
var fs = require('fs')
const port    = 13334
const address = '0.0.0.0'
var counter = 0
quic.listen(port, address)
  .onData((data, stream, buffer) => {
  	counter +=1
  	fs.appendFileSync('received' + counter, data)
	console.log(fs.statSync('received' + counter)['size'])
    // const parsedData = JSON.parse(data)
 
    // console.log(parsedData) // { hello: 'world!' }
 
    // Once the data is received and logged, we'll send it right back
    // stream.write(parsedData)
  })
