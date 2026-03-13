import { test } from '@japa/runner'
import { UserService } from '#services/users/user_service'
import { InMemoryUserRepository } from '../../app/repositories/in-memory-test/in_memory_user_repository.ts'
import { Roles } from '#enums/roles'
import { MakeUser } from '#tests/factories/make_user'

test.group('UserService', (group) => {
  let userService: UserService
  let inMemoryUserRepository: InMemoryUserRepository

  group.each.setup(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    userService = new UserService(inMemoryUserRepository)
  })

  test('(CREATE)should not allow creating a user with same role (admin allows) than creator', async ({
    assert,
  }) => {
    await assert.rejects(
      () =>
        userService.createUser({
          email: 'test@example.com',
          password: 'password',
          role: Roles.MANAGER,
          creatorRole: Roles.MANAGER,
        }),
      `User with role manager cannot create/update/delete user with role manager`
    )
  })

  test('(CREATE)should not allow creating a user with higher role than creator', async ({
    assert,
  }) => {
    await assert.rejects(
      () =>
        userService.createUser({
          email: 'test@example.com',
          password: 'password',
          role: Roles.ADMIN,
          creatorRole: Roles.FINANCE,
        }),
      `User with role finance cannot create/update/delete user with role admin`
    )
  })

  test('(CREATE)should throw error when already exist user with same email (create user) ', async ({
    assert,
  }) => {
    const { user } = await MakeUser({ role: Roles.ADMIN })
    inMemoryUserRepository.users.push(user)

    await assert.rejects(
      () =>
        userService.createUser({
          email: user.email,
          password: 'password',
          role: Roles.USER,
          creatorRole: user.role,
        }),
      `User with email ${user.email} already exists`
    )
  })

  test('(CREATE)should create user', async ({ assert }) => {
    const { user: user1 } = await MakeUser({ role: Roles.ADMIN })
    inMemoryUserRepository.users.push(user1)

    const user = await userService.createUser({
      email: 'test@example.com',
      password: 'password',
      role: Roles.USER,
      creatorRole: user1.role,
    })

    assert.equal(user.user.email, 'test@example.com')
    assert.equal(inMemoryUserRepository.users.length, 2)
  })

  test('(UPDATE)should throw an error when user is not found', async ({ assert }) => {
    const userId = 'non-existent-id'

    await assert.rejects(
      () =>
        userService.updateUser({
          id: userId,
          updaterRole: Roles.ADMIN,
        }),
      `User with id ${userId} does not exist`
    )
  })

  test('(UPDATE)should not allow update a user with same role (admin allows) than updater', async ({
    assert,
  }) => {
    await assert.rejects(
      () =>
        userService.updateUser({
          id: 'aleatoryId',
          email: 'test@example.com',
          password: 'password',
          role: Roles.MANAGER,
          updaterRole: Roles.MANAGER,
        }),
      `User with role manager cannot create/update/delete user with role manager`
    )
  })

  test('(UPDATE)should not allow update a user with higher role (admin allows) than updater', async ({
    assert,
  }) => {
    await assert.rejects(
      () =>
        userService.updateUser({
          id: 'aleatoryId',
          email: 'test@example.com',
          password: 'password',
          role: Roles.ADMIN,
          updaterRole: Roles.FINANCE,
        }),
      `User with role finance cannot create/update/delete user with role admin`
    )
  })

  test('(UPDATE)should throw error when already exist user with same email', async ({ assert }) => {
    const { user } = await MakeUser({ role: Roles.ADMIN })
    inMemoryUserRepository.users.push(user)
    const { user: user2 } = await MakeUser({ role: Roles.USER })
    inMemoryUserRepository.users.push(user2)

    await assert.rejects(
      () =>
        userService.updateUser({
          id: user2.id,
          email: user.email,
          role: Roles.USER,
          updaterRole: user.role,
        }),
      `User with email ${user.email} already exists`
    )
  })

  test('(UPDATE)should update user', async ({ assert }) => {
    const { user: user1 } = await MakeUser({ role: Roles.ADMIN })
    inMemoryUserRepository.users.push(user1)
    const { user: user2 } = await MakeUser({ role: Roles.MANAGER })
    inMemoryUserRepository.users.push(user2)

    const user = await userService.updateUser({
      id: user2.id,
      email: 'test@example.com',
      role: Roles.USER,
      updaterRole: user1.role,
    })

    assert.equal(user.user.email, 'test@example.com')
    assert.equal(inMemoryUserRepository.users[1].email, 'test@example.com')
    assert.equal(inMemoryUserRepository.users[1].role, Roles.USER)
  })

  test('(DELETE)should throw an error when user is not found', async ({ assert }) => {
    const userId = 'non-existent-id'

    await assert.rejects(
      () =>
        userService.deleteUser({
          id: userId,
          deleterRole: Roles.ADMIN,
        }),
      `User with id ${userId} does not exist`
    )
  })

  test('(DELETE)should not allow delete a user with same role (admin allows) than deleter', async ({
    assert,
  }) => {
    const { user: user } = await MakeUser({ role: Roles.MANAGER })
    inMemoryUserRepository.users.push(user)
    await assert.rejects(
      () =>
        userService.deleteUser({
          id: user.id,
          deleterRole: Roles.MANAGER,
        }),
      `User with role manager cannot create/update/delete user with role manager`
    )
  })

  test('(DELETE)should not allow delete a user with higher role (admin allows) than deleter', async ({
    assert,
  }) => {
    const { user: user } = await MakeUser({ role: Roles.MANAGER })
    inMemoryUserRepository.users.push(user)
    await assert.rejects(
      () =>
        userService.deleteUser({
          id: user.id,
          deleterRole: Roles.FINANCE,
        }),
      `User with role finance cannot create/update/delete user with role manager`
    )
  })

  test('(DELETE)should delete user', async ({ assert }) => {
    const { user: user1 } = await MakeUser({ role: Roles.ADMIN })
    inMemoryUserRepository.users.push(user1)
    const { user: user2 } = await MakeUser({ role: Roles.MANAGER })
    inMemoryUserRepository.users.push(user2)

    await userService.deleteUser({
      id: user2.id,
      deleterRole: user1.role,
    })

    assert.equal(inMemoryUserRepository.users.length, 1)
  })

  test('(GET USER)should throw an error when user is not found', async ({ assert }) => {
    const userId = 'non-existent-id'

    await assert.rejects(
      () =>
        userService.getUserById({
          id: userId,
        }),
      `User with id ${userId} does not exist`
    )
  })

  test('(GET USER)should get user', async ({ assert }) => {
    const { user: user1 } = await MakeUser({ role: Roles.ADMIN })
    inMemoryUserRepository.users.push(user1)
    const { user: user2 } = await MakeUser({ role: Roles.MANAGER })
    inMemoryUserRepository.users.push(user2)

    const user = await userService.getUserById({
      id: user2.id,
    })

    assert.equal(user.id, user2.id)
  })

  test('(LIST USERS)should list users with pagination', async ({ assert }) => {
    const { user: user1 } = await MakeUser({ role: Roles.ADMIN })
    inMemoryUserRepository.users.push(user1)
    const { user: user2 } = await MakeUser({ role: Roles.MANAGER })
    inMemoryUserRepository.users.push(user2)

    const users = await userService.listUsers({
      page: 1,
      limit: 1,
    })

    assert.equal(users.data.length, 1)
    assert.equal(users.total, 2)
  })
})
