export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@features/(.*)$": "<rootDir>/src/features/$1",
      "^@lib/(.*)$": "<rootDir>/src/lib/$1",
        "^@shared/(.*)$": "<rootDir>/src/shared/$1",
        "^@store/(.*)$": "<rootDir>/src/store/$1",
        "^@styles/(.*)$": "<rootDir>/src/styles/$1",
        "^@routes/(.*)$": "<rootDir>/src/routes/$1"
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
}