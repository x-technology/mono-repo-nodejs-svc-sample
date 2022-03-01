---
to: packages/services/grpc/<%= name %>/src/server.ts
---
import { Server, LoadProtoOptions, currencyProvider } from '@common/go-grpc';

const { PORT = 50051 } = process.env;
const protoOptions: LoadProtoOptions = {
  path: `${__dirname}/../../../../../proto/<%= proto %>`,
  package: '<%= package %>',
  service: '<%= service %>',
};

const server = new Server(`0.0.0.0:${PORT}`, protoOptions);

// gRPC methods implementation 👇

export default server;
