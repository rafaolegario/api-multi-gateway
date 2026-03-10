import type { ApplicationService } from '@adonisjs/core/types'
import { UserRepository } from '#repositories/contracts/user_repository'
import { LucidUserRepository } from '#repositories/lucid/lucid_user_repository'
import { TokenProvider } from '#services/auth/contracts/token_provider'
import { DbTokenProvider } from '#services/auth/db_token_provider'
import { AuthenticateService } from '#services/auth/authenticate_service'

export default class DependencyProvider {
  constructor(protected app: ApplicationService) { }

  register() {
    this.app.container.singleton(UserRepository, () => {
      return new LucidUserRepository()
    })

    this.app.container.singleton(TokenProvider, () => {
      return new DbTokenProvider()
    })

    this.app.container.singleton(AuthenticateService, async () => {
      const userRepository = await this.app.container.make(UserRepository)
      const tokenProvider = await this.app.container.make(TokenProvider)
      return new AuthenticateService(userRepository, tokenProvider)
    })
  }
}
