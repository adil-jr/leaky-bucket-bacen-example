module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@leaky-bucket/(.*)$': '<rootDir>/packages/$1/src',
  },
  roots: ['<rootDir>/packages'],
};
