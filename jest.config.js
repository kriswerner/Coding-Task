module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testEnvironment: 'jest-environment-jsdom',
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '\\.html$': '<rootDir>/__mocks__/htmlMock.js',
        '\\.scss$': '<rootDir>/__mocks__/styleMock.js',
    },
    testMatch: ['<rootDir>/test/**/*.spec.ts', '<rootDir>/src/**/*.spec.ts'],
}