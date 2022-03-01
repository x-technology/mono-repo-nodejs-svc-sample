const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const protoFileName = "./prices.proto"

const packageDefinition = protoLoader.loadSync(protoFileName, {
  includeDirs: [__dirname]
})
const proto = grpc.loadPackageDefinition(packageDefinition)

const prices = require('./prices.json')

const list = (call, callback) => {
  console.log(call)
  callback(null, { prices })
}

const listStream = (call, callback) => {
  console.log(call)

  prices.forEach((price, index) => {
    setTimeout(() => {
      call.write(price);
    }, 500 * index)
  })

  setTimeout(() => {
    call.end()
  }, 500 * prices.length)
}

const get = (call, callback) => {
  console.log(call)
  const { request: { Date } } = call

  const found = prices.find(price => (
    price.Date === Date
  ));

  if (!found) {
    callback({ message: "not-found"}, null)
    return;
  }

  callback(null, found)
}

const server = new grpc.Server()
server.addService(proto.bitcoinPrices.HistoryData.service, {
  get, 
  list,
  listStream,
})

server.bindAsync('0.0.0.0:8001', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    throw error
  }

  server.start()
  console.log(`listenting on ${port}`)
})