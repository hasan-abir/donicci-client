module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-vector-icons|@gluestack-ui|@expo|@legendapp|@react-navigation)/)',
  ],
  modulePathIgnorePatterns: ['<rootDir>/__tests__/setup'],
  moduleNameMapper: {
    '^uuid$': 'uuid',
  },
  setupFiles: ['<rootDir>/jest/setup.js'],
  fakeTimers: {
    enableGlobally: true,
  },
  testMatch: [
    '<rootDir>/__tests__/unit/**/*.test.tsx',
    '<rootDir>/__tests__/unit/**/*.test.ts',
  ],
};
