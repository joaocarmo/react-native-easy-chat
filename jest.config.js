module.exports = {
  coveragePathIgnorePatterns: ['./src/__tests__/'],
  preset: 'react-native',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  modulePathIgnorePatterns: [
    '<rootDir>/example-expo',
    '<rootDir>/example-slack-message',
  ],
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/*.test.ts?(x)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
}
