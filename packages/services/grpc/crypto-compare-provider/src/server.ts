import { Server, LoadProtoOptions, currencyProvider } from '@common/go-grpc';
import getRates from './services/getRates';

const { PORT = 50051 } = process.env;
const protoOptions: LoadProtoOptions = {
  path: `${__dirname}/../../../../../proto/crypto-compare-provider.proto`,
  package: 'cryptoCompareProvider',
  service: 'CryptoCompareProvider',
};

const server = new Server(`0.0.0.0:${PORT}`, protoOptions);

// gRPC methods implementation
server
  .addService<currencyProvider.GetRatesRequest,
    Promise<currencyProvider.GetRatesResponse>>('GetRates', getRates);

export default server;
