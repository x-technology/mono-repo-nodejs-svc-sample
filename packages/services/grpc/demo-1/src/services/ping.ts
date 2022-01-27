import { demo, createInsecure } from '@common/go-grpc';
import { trace, api } from '@common/tracer';

const tracer = trace('demo-1');

const demoServerHost = 'localhost:50051';
const client = new demo.DemoClient(
  demoServerHost,
  createInsecure(),
);

// eslint-disable-next-line import/prefer-default-export
export const ping = async (
  grpcRequest: demo.PingRequest,
): Promise<demo.PingResponse> => {
  const { payload } = grpcRequest;

  const span = tracer.startSpan('client.js:main()');
  console.log('span:', span)
  api.context.with(api.trace.setSpan(api.context.active(), span), () => {
    console.log('Client traceId ', span.spanContext().traceId);
    span.addEvent(`demo-1:ping() to ${payload}`);
  
    setTimeout(async () => {
      await client.Ping(new demo.PingRequest({
        payload: 'ping-1',
      }));

      span.end();
    }, 500)
  })

  return new demo.PingResponse({
    payload: `${payload} - pong-1`,
  });
};
