import { demo } from '@common/go-grpc';
import { trace } from '@common/tracer';

const tracer = trace('demo');

// eslint-disable-next-line import/prefer-default-export
export const ping = async (
  grpcRequest: demo.PingRequest,
): Promise<demo.PingResponse> => {
  const { payload } = grpcRequest;

  const span = tracer.startSpan('ping begin');
  span.end();

  return new demo.PingResponse({
    payload: `${payload} - pong`,
  });

  
};
