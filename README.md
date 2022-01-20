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
