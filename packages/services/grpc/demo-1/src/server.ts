import { Server, LoadProtoOptions, demo } from '@common/go-grpc';
import { ping } from './services/ping';

const { PORT = 50052 } = process.env;
const protoOptions: LoadProtoOptions = {
  path: `${__dirname}/../../../../../proto/demo.proto`,
  package: 'demo',
  service: 'Demo',
  options: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
};

const server = new Server(`0.0.0.0:${PORT}`, protoOptions);

// gRPC methods implementation
server
  .addService<demo.PingRequest,
    Promise<demo.PingResponse>>('Ping', ping);

export default server;
