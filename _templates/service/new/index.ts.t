---
to: packages/services/grpc/<%= name %>/index.ts
---
require('./setup.ts');

// Import the rest of our application.
module.exports = require('./src/index.ts');
