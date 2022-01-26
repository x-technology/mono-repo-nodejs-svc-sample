module.exports = {
  cache: false,
  testEnvironment: 'node',
  setupFilesAfterEnv: ["./setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    '^.+\\.(ts|tsx)?$': 'babel-jest'
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ]
};
