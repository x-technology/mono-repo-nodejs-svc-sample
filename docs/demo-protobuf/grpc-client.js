const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const protoFileName = "./prices.proto"

const packageDefinition = protoLoader.loadSync(protoFileName, {
  includeDirs: [__dirname]
})
const proto = grpc.loadPackageDefinition(packageDefinition)

const client = new proto.bitcoinPrices.HistoryData('0.0.0.0:8001', grpc.credentials.createInsecure());

client.list(null, (error, response) => {
  if (error) {
    throw error
  }

  console.log("read currencies from server " + JSON.stringify(response))
})