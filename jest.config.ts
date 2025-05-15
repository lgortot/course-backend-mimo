import type { Config } from '@jest/types'
import { defaultsESM } from 'ts-jest/presets'

const config: Config.InitialOptions  = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    ...defaultsESM.transform,
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
  },
}

export default config