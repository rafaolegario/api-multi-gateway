import { Roles } from '#enums/roles'
import User from '#models/user'
import { faker } from '@faker-js/faker'
import hash from '@adonisjs/core/services/hash'
import { randomUUID } from 'node:crypto'

interface MakeUserResult {
  user: User
  plainPassword: string
}

export async function MakeUser(override: Partial<User> = {}): Promise<MakeUserResult> {
  const plainPassword = override.password ?? faker.internet.password()

  const user = new User()
  user.id = randomUUID()
  user.email = override.email ?? faker.internet.email()
  user.password = await hash.make(plainPassword)
  user.role = override.role ?? Roles.USER
  user.$isPersisted = true

  return { user, plainPassword }
}
