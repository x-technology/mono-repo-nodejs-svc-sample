import {
  Server as GrpcServer,
  ServerCredentials,
  StatusBuilder,
  StatusObject,
  status,
  ServiceDefinition,
  loadPackageDefinition,
  credentials,
  Metadata,
  ChannelCredentials,
} from '@grpc/grpc-js';

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const protoLoader = require('@grpc/proto-loader');

const { SHUTDOWN_TIMEOUT = '1000' } = process.env;
const defaultShutdownTimeout = parseInt(SHUTDOWN_TIMEOUT, 10);

// eslint-disable-next-line no-unused-vars
type Input<I, R> = (input: I) => R;
// eslint-disable-next-line no-unused-vars
type Callback<R> = (error?: StatusObject, result?: R) => void;

const errorToStatus = (err: Error): StatusObject => {
  const details = err.message;
  const code = status.UNKNOWN;
  return new StatusBuilder()
    .withCode(code)
    .withDetails(details)
    .build() as StatusObject;
};

function serviceRequest<I, R>(fn: Input<I, R>) {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  return async (call: any, callback: Callback<R>) => {
    const obj = call.request;
    // eslint-disable-next-line dot-notation
    delete obj['req'];

    try {
      const result = await fn(call.request);
      callback(null, result);
    } catch (error) {
      callback(errorToStatus(error));
    }
  };
}

interface LoadProtoOptions {
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: { [name: string]: any },
  package: string,
  service: string,
}

const createInsecure = (): ChannelCredentials => credentials.createInsecure();

class Server {
  // internal grpc server definition
  private server: GrpcServer;

  // host provided for grpc server
  private readonly host: string;

  // services definition
  private readonly service: ServiceDefinition;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly impl: { [name: string]: any };

  constructor(
    host = '0.0.0.0:50051',
    protoOptions: LoadProtoOptions,
  ) {
    this.host = host;
    this.server = new GrpcServer();
    this.impl = {};

    const options = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      ...protoOptions.options && protoOptions.options,
    };
    const definition = protoLoader.loadSync(protoOptions.path, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grpcObject: any = loadPackageDefinition(definition);
    this.service = grpcObject[protoOptions.package][protoOptions.service].service;
  }

  public addService<I, R>(methodName: string, serviceImplementation: Input<I, R>): Server {
    this.impl[methodName] = serviceRequest<I, R>(serviceImplementation);
    return this;
  }

  public async start(host = ''): Promise<void> {
    // eslint-disable-next-line no-param-reassign
    host = host || this.host;
    return new Promise((resolve, reject) => {
      this.server.addService(this.service, this.impl);
      this.server.bindAsync(
        host,
        ServerCredentials.createInsecure(),
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          this.server.start();
          console.log(`server stated at ${host}`);
          resolve();
        },
      );
    });
  }

  public async stop(timeout = defaultShutdownTimeout): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        this.server.tryShutdown((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
        const tm = setTimeout(() => {
          this.server.forceShutdown();
          resolve();
        }, timeout);
        // eslint-disable-next-line no-undef
        const timer: NodeJS.Timeout = (tm as unknown) as NodeJS.Timeout;
        timer.unref();
      });
    } catch (e) {
      this.server.forceShutdown();
    }
  }
}

export {
  serviceRequest,
  Server,
  LoadProtoOptions,
  createInsecure,
  Metadata,
};
