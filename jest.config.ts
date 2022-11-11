import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  clearMocks: false,
  verbose: true,
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>', '<rootDir>/src/libs/'],
  moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src'],
};
export default config;
