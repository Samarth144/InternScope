module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
  },
};
