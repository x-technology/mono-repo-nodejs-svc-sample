import { demo, createInsecure } from '@common/go-grpc';
import server from '../../src/server';

const testServerHost = 'localhost:50061';
const client = new demo.DemoClient(
  testServerHost,
  createInsecure(),
);

describe('demo', () => {
  beforeAll(async () => {
    await server.start(testServerHost);
  });
  afterAll(async () => {
    await server.stop();
  });
  describe('ping', () => {
    it('should return pong', async () => {
      const response = await client.Ping(new demo.PingRequest({
        payload: 'ping',
      }));

      expect(response.payload).toEqual('ping - pong');
    });
  });
});
