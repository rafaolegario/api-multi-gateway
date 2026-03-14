import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import { Roles } from '#enums/roles'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

async function truncateAll() {
  await db.rawQuery('SET FOREIGN_KEY_CHECKS = 0')
  await db.rawQuery('TRUNCATE TABLE transaction_products')
  await db.rawQuery('TRUNCATE TABLE transactions')
  await db.rawQuery('TRUNCATE TABLE products')
  await db.rawQuery('TRUNCATE TABLE clients')
  await db.rawQuery('TRUNCATE TABLE gateways')
  await db.rawQuery('TRUNCATE TABLE auth_access_tokens')
  await db.rawQuery('TRUNCATE TABLE users')
  await db.rawQuery('SET FOREIGN_KEY_CHECKS = 1')
}

test.group('Auth E2E', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.each.setup(async () => {
    await truncateAll()
  })

  test('should login successfully and return a token', async ({ client, assert }) => {
    await User.create({
      email: 'admin@test.com',
      password: await hash.make('password123'),
      role: Roles.ADMIN,
    })

    const response = await client.post('/auth/login').json({
      email: 'admin@test.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.property(response.body(), 'token')
  })

  test('should return 401 for invalid credentials', async ({ client }) => {
    await User.create({
      email: 'admin@test.com',
      password: await hash.make('password123'),
      role: Roles.ADMIN,
    })

    const response = await client.post('/auth/login').json({
      email: 'admin@test.com',
      password: 'wrongpassword',
    })

    response.assertStatus(401)
  })

  test('should return 401 when accessing protected route without token', async ({ client }) => {
    const response = await client.get('/users?page=1&limit=10')

    response.assertStatus(401)
  })

  test('should return 401 when USER tries to access /users (requires ADMIN or MANAGER)', async ({
    client,
  }) => {
    const user = await User.create({
      email: 'user@test.com',
      password: await hash.make('password123'),
      role: Roles.USER,
    })

    const response = await client.get('/users?page=1&limit=10').loginAs(user)

    response.assertStatus(401)
  })

  test('should allow ADMIN to access /users', async ({ client }) => {
    const admin = await User.create({
      email: 'admin@test.com',
      password: await hash.make('password123'),
      role: Roles.ADMIN,
    })

    const response = await client.get('/users?page=1&limit=10').loginAs(admin)

    response.assertStatus(200)
  })
})
