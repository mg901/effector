//@flow

const watchPathIgnorePatterns = [
  '<rootDir>/.effector/',
  '<rootDir>/.github/',
  '<rootDir>/.vscode/',
  '<rootDir>/bench/',
  '<rootDir>/coverage/',
  '<rootDir>/docs/',
  '<rootDir>/examples/',
  '<rootDir>/flow/',
  '<rootDir>/flow-typed/',
  '<rootDir>/integrations/',
  '<rootDir>/node_modules/',
  '<rootDir>/npm/',
  '<rootDir>/recipies/',
  '<rootDir>/rfc/',
  '<rootDir>/scripts/',
  '<rootDir>/stats/',
  '<rootDir>/tasks/',
  '<rootDir>/tools/',
  '<rootDir>/website/',
]
const createDefaultConfig = () => ({
  automock: false,
  browser: false,
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  // moduleNameMapper: {},
  modulePathIgnorePatterns: watchPathIgnorePatterns,
  testPathIgnorePatterns: watchPathIgnorePatterns,
  transformIgnorePatterns: [
    ...watchPathIgnorePatterns,
    'node_modules/(?!(bs-platform)/)',
  ],
  watchPathIgnorePatterns,
  // roots: ['<rootDir>/src/'],
})

module.exports = {
  collectCoverage: boolean(process.env.COVERAGE, false),
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/*.test.js',
    '!**/*.spec.js',
    '!<rootDir>/src/babel/**',
    '!<rootDir>/src/fixtures/**',
    '!<rootDir>/src/redux/**',
  ],
  watchPathIgnorePatterns,
  projects: createProjectList([
    {
      effector: {
        testMatch: [`<rootDir>/src/effector/__tests__/**/*.test.js`],
      },
    },
    'effector/kernel',
    'static-land',
    'forms',
    'babel',
    // 'redux',
    {
      react: {
        testEnvironment: 'jsdom',
        testMatch: [
          `<rootDir>/src/react/**/*.test.js`,
          `<rootDir>/src/react/**/*.spec.js`,
        ],
        // setupFiles: ['<rootDir>/src/fixtures/performance.mock.js'],
        // watchPathIgnorePatterns,
      },
    },
    {
      reason: {
        testMatch: [`<rootDir>/src/reason/**/*_test.bs.js`],
      },
    },
    !boolean(process.env.NO_TYPE_TESTS, false) && {
      types: {
        testMatch: [
          `<rootDir>/src/types/__tests__/**/*.test.js`,
          `<rootDir>/src/types/__tests__/**/*.spec.js`,
          `<rootDir>/src/types/__tests__/**/*.test.ts`,
          `<rootDir>/src/types/__tests__/**/*.spec.ts`,
          `<rootDir>/src/types/__tests__/**/*.test.tsx`,
          `<rootDir>/src/types/__tests__/**/*.spec.tsx`,
        ],
        browser: false,
        globalSetup: './src/types/src/globalSetup.js',
        globalTeardown: './src/types/src/globalTeardown.js',
        maxConcurrency: 25,
        transform: {
          '^.+\\.jsx?$': 'babel-jest',
          '^.+\\.tsx?$': 'babel-jest',
        },
      },
    },
  ]),
}

function createProjectList(items) {
  items = items.filter(Boolean)
  const list = []
  for (const item of items) {
    if (typeof item === 'string') {
      const project = Object.assign(
        {},
        createDefaultConfig(),
        {
          testMatch: [
            `<rootDir>/src/${item}/**/*.test.js`,
            `<rootDir>/src/${item}/**/*.spec.js`,
          ],
        },
        {
          displayName: item,
        },
      )
      list.push(project)
    } else {
      for (const key in item) {
        const val = item[key]
        const project = Object.assign(
          {},
          createDefaultConfig(),
          {
            testMatch: [
              `<rootDir>/src/${key}/**/*.test.js`,
              `<rootDir>/src/${key}/**/*.spec.js`,
            ],
          },
          val,
          {displayName: key},
        )
        list.push(project)
      }
    }
  }
  return list
}

function boolean(
  value /*: string | boolean | null | void*/,
  defaults /*: boolean*/,
) /*: boolean*/ {
  switch (value) {
    case 'no':
    case 'false':
    case false:
      return false
    case 'yes':
    case 'true':
    case true:
      return true
    case null:
    case undefined:
    default:
      return defaults
  }
}
