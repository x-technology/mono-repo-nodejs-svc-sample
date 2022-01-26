import { Server, LoadProtoOptions, currencyConverter } from '@common/go-grpc';
import convert from './services/convert';

const { PORT = 50051 } = process.env;
const protoOptions: LoadProtoOptions = {
  path: `${__dirname}/../../../../../proto/currency-converter.proto`,
  package: 'currencyConverter',
  service: 'CurrencyConverter',
};

const server = new Server(`0.0.0.0:${PORT}`, protoOptions);

// gRPC methods implementation
server
  .addService<currencyConverter.ConvertRequest,
    Promise<currencyConverter.ConvertResponse>>('Convert', convert);

export default server;
