module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testRegex: '.*\\.test\\.js$',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-scripts/config/jest/babelTransform.js'
  }
};
