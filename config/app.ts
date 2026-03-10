import env from '#start/env'
import { defineConfig } from '@adonisjs/core/http'

export const appKey = env.get('APP_KEY')

export const appUrl = env.get('APP_URL')

export const http = defineConfig({
  generateRequestId: true,
  allowMethodSpoofing: false,
  useAsyncLocalStorage: false,
})
