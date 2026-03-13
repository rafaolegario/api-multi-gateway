import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  // Database
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_NAME: Env.schema.string(),

  // JWT
  JWT_SECRET: Env.schema.secret(),

  // Payment Gateways
  GATEWAY_1_URL: Env.schema.string(),
  GATEWAY_1_EMAIL: Env.schema.string({ format: 'email' }),
  GATEWAY_1_TOKEN: Env.schema.string(),

  GATEWAY_2_URL: Env.schema.string(),
  GATEWAY_2_AUTH_TOKEN: Env.schema.string(),
  GATEWAY_2_AUTH_SECRET: Env.schema.string(),
})
