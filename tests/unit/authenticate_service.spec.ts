import { test } from '@japa/runner'
import { AuthenticateService } from '#services/auth/authenticate_service'
import { InMemoryUserRepository } from '../../app/repositories/in-memory-test/in_memory_user_repository.ts'
import { InMemoryTokenProvider } from '../../app/repositories/in-memory-test/in_memory_token_provider.ts'
import { MakeUser } from '#tests/factories/make_user'
import { Roles } from '#enums/roles'
import { InvalidCredentialsException } from '#services/errors/invalid_credentials_exception'

test.group('AuthenticateService', (group) => {
  let authenticateService: AuthenticateService
  let inMemoryUserRepository: InMemoryUserRepository
  let inMemoryTokenProvider: InMemoryTokenProvider

  group.each.setup(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryTokenProvider = new InMemoryTokenProvider()
    authenticateService = new AuthenticateService(inMemoryUserRepository, inMemoryTokenProvider)
  })

  test('User should be able to login', async ({ assert }) => {
    const { user, plainPassword } = await MakeUser({ role: Roles.ADMIN })

    inMemoryUserRepository.users.push(user)

    const token = await authenticateService.login({
      email: user.email,
      password: plainPassword,
    })
    assert.isString(token)
    assert.isTrue(token.startsWith('oat_'))
  })

  test('User should not be able to login with password', async ({ assert }) => {
    const { user } = await MakeUser({ role: Roles.ADMIN })

    inMemoryUserRepository.users.push(user)
    await assert.rejects(
      () =>
        authenticateService.login({
          email: user.email,
          password: 'wrong-password',
        }),
      InvalidCredentialsException
    )
  })

  test('User should not be able to login with email', async ({ assert }) => {
    const { user, plainPassword } = await MakeUser({ role: Roles.ADMIN })

    inMemoryUserRepository.users.push(user)
    await assert.rejects(
      () =>
        authenticateService.login({
          email: 'wrong@email.com',
          password: plainPassword,
        }),
      InvalidCredentialsException
    )
  })
})
