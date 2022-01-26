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

1. For example, we want to create a new `logger` library.
2. Create a folder under `./packages/common/` path. For simplicity, just copy an existing lib and rename it.
```shell
mkdir ./packages/common/logger
```
3. Go to the folder in the terminal
```shell
cd ./packages/common/logger
```
4. Install dependencies
```shell
yarn install
```
4. Make sure to define appropriate name in the package.json file:
```json
"name": "@common/logger",
```
Let's follow a rule all common libraries have a prefix `@common/`
5. Create our library in a `src/index.js`
```shell
export const debug = (message: string) => console.debug(message);
export const info = (message: string) => console.info(message);
export const error = (message: string) => console.error(message);

export default { debug, info, error };
```
6. Make sure it builds successfully withing a command:
```shell
yarn build
```
7. Let's connect our newly created library somewhere in the existing service:
```shell
yarn lerna add @common/logger --scope=@grpc/ecb-provider
```
8. The final step, we need to use the library inside ecb-provider service.
   Let's amend file `./src/index.ts`:

```typescript
import logger from '@common/logger';

logger.debug('service has started');
```

9. Re-build currency-converter to ensure the is not issues
```shell
yarn build
```

Yay! 🎉 It works!

### How to create a new service?

1. For example, we want to create a new `crypto-compare-provider` service, which is another currency rate provider returning cryptocurrencies.
2. Create a folder under `./packages/services/grpc/crypto-compare-provider` path. For simplicity, just copy an existing `ecb-provider` and rename it.
```shell
mkdir ./packages/services/grpc/crypto-compare-provider
```
3. Go to the folder in the terminal
```shell
cd ./packages/services/grpc/crypto-compare-provider
```

3. Install dependencies
```shell
yarn install
```
4. Make sure to define appropriate name in the package.json file:
```json
"name": "@grpc/crypto-compare-provider",
```
Let's follow a rule - all grpc services have a prefix `@grpc/`.
5. Create a service method file `packages/services/grpc/crypto-provider/src/services/getRates.ts`
```shell
import { currencyProvider } from '@common/go-grpc';

export default async (
  _: currencyProvider.GetRatesRequest,
): Promise<currencyProvider.GetRatesResponse> => {
  return new currencyProvider.GetRatesResponse({
    rates: [],
    baseCurrency: 'USD',
  });
};
```
6. So next we need to use this method inside server.ts
```typescript
import { Server, LoadProtoOptions, currencyProvider } from '@common/go-grpc';
import getRates from './services/getRates';

const { PORT = 50051 } = process.env;
const protoOptions: LoadProtoOptions = {
  path: `${__dirname}/../../../../../proto/crypto-compare-provider.proto`,
  // this value should be equvalent to the one defined in *.proto file as "package cryptoCompareProvider;"
  package: 'cryptoCompareProvider',
  // this value should be equvalent to the one defined in *.proto file as "service CryptoCompareProvider"  
  service: 'CryptoCompareProvider',
};

const server = new Server(`0.0.0.0:${PORT}`, protoOptions);
server
  .addService<currencyProvider.GetRatesRequest,
    Promise<currencyProvider.GetRatesResponse>>('GetRates', getRates);
export default server;
```
7. Make sure it builds successfully withing a command:
```shell
yarn build
```
8. Start the service with the command:
```shell
yarn start
```
