import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthenticationMiddleware {
  async handle({ auth }: HttpContext, next: NextFn) {
    auth.getUserOrFail()
    await next()
  }
}
