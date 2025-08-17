export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@/(.*)$': '<rootDir>/client/src/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(nanoid)/)'
  ],
  testMatch: [
    '<rootDir>/server/tests/**/*.test.ts',
    '<rootDir>/client/src/**/*.test.tsx',
    '<rootDir>/client/src/**/*.test.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts']
};