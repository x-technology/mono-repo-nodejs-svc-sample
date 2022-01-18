# mono-repo-nodejs-svc-sample
This mono repository contains a sample of micro-services architecture built on top of gRPC protocol and TypeScript node.js applications


## Getting started

Install `protoc` for generating definitions based on `.proto` files

```shell
brew install protobuf
protoc --version  # Ensure compiler version is 3+
```

Prepare environment
```shell
yarn install
yarn lerna bootstrap
```

Build common packages, so we're able to use it for our services
```shell
yarn lerna run build
```

## FAQ

### How to create a new library?

### How to create a new service?

### How to try out it is working?

see tests...

```bash
node
Welcome to Node.js v14.15.5.
Type ".help" for more information.
> const { demo, createInsecure } = require('@common/go-grpc')
undefined
> demo
{
  PingRequest: [class PingRequest],
  PingResponse: [class PingResponse],
  UnimplementedDemoService: [class UnimplementedDemoService] { definition: { Ping: [Object] } },
  DemoClient: [Function: DemoClient]
}
> const testServerHost = 'localhost:50051';
undefined
> const client = new demo.DemoClient(testServerHost, createInsecure());
undefined
> const response = await client.Ping(new demo.PingRequest({ payload: 'ping' }));
const response = await client.Ping(new demo.PingRequest({ payload: 'ping' }));
                 ^^^^^

Uncaught SyntaxError: await is only valid in async function
> const response = client.Ping(new demo.PingRequest({ payload: 'ping' }));
undefined
> response
Promise {
  PingResponse {
    wrappers_: null,
    messageId_: undefined,
    arrayIndexOffset_: -1,
    array: [ 'ping - pong' ],
    pivot_: 1.7976931348623157e+308,
    convertedPrimitiveFields_: {}
  }
}

// trace
const { demo, createInsecure } = require('@common/go-grpc')
const demo1ServerHost = 'localhost:50051'
const demo2ServerHost = 'localhost:50052'
const client1 = new demo.DemoClient(demo1ServerHost, createInsecure());
const client2 = new demo.DemoClient(demo2ServerHost, createInsecure());
undefined
client1.Ping(new demo.PingRequest({ payload: 'ping' }))
client2.Ping(new demo.PingRequest({ payload: 'ping' }))

const span = tracer.startSpan('client.js:main()');
```