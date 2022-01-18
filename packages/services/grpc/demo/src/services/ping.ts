import { demo } from '@common/go-grpc';
import { trace, api } from '@common/tracer';

const tracer = trace('demo');

// eslint-disable-next-line import/prefer-default-export
export const ping = async (
  grpcRequest: demo.PingRequest,
): Promise<demo.PingResponse> => {
  const { payload } = grpcRequest;

  const currentSpan = api.trace.getSpan(api.context.active());
  console.log('currentSpan:', currentSpan)
  // display traceid in the terminal
  console.log(`traceid: ${currentSpan.spanContext().traceId}`);

  const span = tracer.startSpan('demo:ping()', {
    kind: 1, // server
  });
  span.addEvent(`demo:ping() to ${payload}`);
  setTimeout(() => {
    span.end();
  }, 500)

  return new demo.PingResponse({
    payload: `${payload} - pong`,
  });
};
