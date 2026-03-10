import type User from '#models/user'
import { TokenProvider } from '#services/auth/contracts/token_provider'
import { randomUUID } from 'node:crypto'

export class InMemoryTokenProvider extends TokenProvider {
  public tokens: Map<string, { userId: string; token: string }> = new Map()

  async create(user: User): Promise<string> {
    const token = `oat_${randomUUID().replace(/-/g, '')}`
    this.tokens.set(token, { userId: user.id, token })
    return token
  }

  async delete(_user: User, tokenId: string): Promise<void> {
    this.tokens.delete(tokenId)
  }

  clear(): void {
    this.tokens.clear()
  }
}
