---
to: packages/services/grpc/<%= name %>/src/index.ts
---
import server from './server';

(async () => {
  await server.start();
})();
