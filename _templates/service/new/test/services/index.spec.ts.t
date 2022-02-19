---
to: packages/services/grpc/<%= name %>/test/services/index.spec.ts
---
import server from '../../src/server';

const testServerHost = 'localhost:50061';

describe('provider', () => {
  beforeAll(async () => {
    await server.start(testServerHost);
  });
  afterAll(async () => {
    await server.stop();
  });
  describe('test', () => {
    it('should complete', async () => {
      
    });
  });
});
