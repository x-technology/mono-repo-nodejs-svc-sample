// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const dotenv = require('dotenv');

dotenv.config();

// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
require('@babel/register')({
  extensions: ['.ts'],
});
