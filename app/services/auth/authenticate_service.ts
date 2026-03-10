import { InvalidCredentialsException } from '#services/errors/invalid_credentials_exception'
import hash from '@adonisjs/core/services/hash'
import { type UserRepository } from '../../repositories/contracts/user_repository.ts'
import { type AuthenticateDTO } from './authenticate_dto.ts'
import { type TokenProvider } from './contracts/token_provider.ts'

export class AuthenticateService {
  constructor(
    private userRepository: UserRepository,
    private tokenProvider: TokenProvider
  ) {}

  async login(data: AuthenticateDTO): Promise<string> {
    const { email, password } = data

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsException()
    }

    const passwordMatches = await hash.verify(user.password, password)

    if (!passwordMatches) {
      throw new InvalidCredentialsException()
    }

    return this.tokenProvider.create(user)
  }
}
