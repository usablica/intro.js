import path from 'path'
import type { Config } from '@jest/types'
import { defaults } from 'jest-config'

const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  coverageDirectory: "coverage",
  setupFiles: [
    './tests/setup.ts'
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  rootDir: path.resolve(__dirname, './'),
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'js'],
  preset: '<rootDir>/node_modules/ts-jest',
  "transform": {
    "\\.js$": "babel-jest",
  }
}

export default config
