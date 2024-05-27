/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
  },
  modulePaths: ['<rootDir>'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'test',
    'coverage',
    '.eslintrc.js',
    'jest.config.js',
    'interfaces',
    'jestGlobalMocks.ts',
    '.module.ts',
    '<rootDir>/src/app/main.ts',
    '.mock.ts',
    '/dist/',
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s'],
};
