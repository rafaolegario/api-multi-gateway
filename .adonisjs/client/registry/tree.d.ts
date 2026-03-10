/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  authenticate: {
    login: typeof routes['authenticate.login']
  }
}
