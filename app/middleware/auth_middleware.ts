import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthenticationMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    try {
      await auth.authenticate()
      await next()
    } catch (error) {
      return response.unauthorized({ message: 'Not authenticated' })
    }
  }
}
