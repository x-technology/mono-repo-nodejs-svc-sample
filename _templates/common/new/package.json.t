---
to: packages/common/<%= name %>/package.json
---
{
  "name": "@common/<%= name %>",
  "version": "1.0.0",
  "private": true,
  "source": "src/index.ts",
  "main": "dist/index.js",
  "typings": "dist/index.d.ts",
  "license": "MIT",
  "author": "<%= author %>",
  "scripts": {
    "build": "TS_NODE_FILES=true tsc",
    "lint": "eslint -c ../../../.eslintrc ./src"
  },
  "dependencies": {
  },
  "devDependencies": {
    "@types/node": "^15.12.4",
    "typescript": "^4.3.4"
  }
}
