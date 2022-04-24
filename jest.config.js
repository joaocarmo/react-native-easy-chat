const esModules = [].join('|')

module.exports = {
  coveragePathIgnorePatterns: ['./src/__tests__/'],
  preset: 'jest-expo',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  modulePathIgnorePatterns: ['<rootDir>/example'],
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/*.test.ts?(x)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!(${esModules})).*/`],
}
