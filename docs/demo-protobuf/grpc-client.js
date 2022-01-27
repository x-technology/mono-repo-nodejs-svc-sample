const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const fs = require('fs')
const {Transform} = require('stream')
const protoFileName = "./prices.proto"

const packageDefinition = protoLoader.loadSync(protoFileName, {
  includeDirs: [__dirname]
})
const proto = grpc.loadPackageDefinition(packageDefinition)

const client = new proto.bitcoinPrices.HistoryData('0.0.0.0:8001', grpc.credentials.createInsecure());

client.get({ Date: "12/01/2021" }, (error, response) => {
  if (error) {
    console.error(error)
    return;
  }

  console.log("find currencies from server " + JSON.stringify(response))
})

client.list(null, (error, response) => {
  if (error) {
    console.error(error)
    return;
  }

  console.log("read currencies from server " + JSON.stringify(response))
})

async function run() {
  for await(const price of client.listStream(null)){
    console.log('Stream price', price);
  }
    // .pipe(toString)
    // .pipe(fs.createWriteStream('prices-as-stream.json'))
    
  console.log('Pipeline succeeded.');
}

run()


// call.on('data', function(price) {
//   console.log('Stream price', price);
// });
// call.on('end', function() {
// // The server has finished sending
// });
// call.on('error', function(e) {
// // An error has occurred and the stream has been closed.
// });
// call.on('status', function(status) {
// // process status
// });