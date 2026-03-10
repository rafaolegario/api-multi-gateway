import User from '#models/user'
import type UserModel from '#models/user'
import { TokenProvider } from './contracts/token_provider.ts'

export class DbTokenProvider extends TokenProvider {
  async create(user: UserModel): Promise<string> {
    const token = await User.accessTokens.create(user)
    return token.value!.release()
  }

  async delete(user: UserModel, tokenId: string): Promise<void> {
    await User.accessTokens.delete(user, tokenId)
  }
}
