export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@/(.*)$': '<rootDir>/client/src/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: false,
      tsconfig: {
        jsx: 'react-jsx'
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(nanoid)/)'
  ],
  testMatch: [
    '<rootDir>/server/tests/**/*.test.ts',
    '<rootDir>/client/src/**/*.test.tsx',
    '<rootDir>/client/src/**/*.test.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts'],
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    'server/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ]
};