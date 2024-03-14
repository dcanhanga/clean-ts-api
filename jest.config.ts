import type { Config } from 'jest';
const config: Config = {
  roots: ['<rootDir>/src/'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  }
};

export default config;
