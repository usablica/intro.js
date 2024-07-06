module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  setupFilesAfterEnv: ["jest-extended/all"],
  roots: ["<rootDir>/tests/jest", "<rootDir>/src"],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      ...require('./tsconfig.test.json')
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFiles: ['<rootDir>/tests/jest/setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.cy.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
  ],
};
