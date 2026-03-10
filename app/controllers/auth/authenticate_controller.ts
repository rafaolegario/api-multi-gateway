import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { AuthenticateService } from '#services/auth/authenticate_service'
import { loginValidator } from '#validators/user'

@inject()
export default class AuthenticateController {
  constructor(private authenticateService: AuthenticateService) {}

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const token = await this.authenticateService.login({ email, password })

    return response.ok({ token })
  }
}
