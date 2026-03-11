import type User from '#models/user'

export abstract class TokenProvider {
  abstract create(user: User): Promise<string>
}
