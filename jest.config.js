/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary', 'html'],
  coverageDirectory: 'coverage',
};