import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Roles } from '#enums/roles'

type AuthorizationOptions = { roles: Roles[] }

export default class AuthorizationMiddleware {
  public async handle(
    { auth, response }: HttpContext,
    next: NextFn,
    options: AuthorizationOptions
  ) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Not authenticated' })
    }

    if (!options.roles.includes(user.role)) {
      return response.unauthorized({ message: 'Not authorized to access this route' })
    }

    await next()
  }
}
