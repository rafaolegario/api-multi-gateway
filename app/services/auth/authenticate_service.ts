import { AuthFinder } from '#models/user'
import { type UserRepository } from '../../repositories/contracts/user_repository.ts'
import { type AuthenticateDTO } from './authenticate_dto.ts'

export class AuthenticateService {
  constructor(private userRepository: UserRepository) { }
  async signIn(data: AuthenticateDTO): Promise<string> {
    const { email, password } = data

    const user = await AuthFinder.
  }
}
