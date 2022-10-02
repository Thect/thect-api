import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>', '<rootDir>/src/libs/'],
  moduleDirectories: ['<rootDir>/node_modules'],
};
export default config;
