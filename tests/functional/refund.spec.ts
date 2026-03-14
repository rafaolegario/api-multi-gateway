import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import { Roles } from '#enums/roles'
import { TransactionStatus } from '#enums/transaction_status'
import User from '#models/user'
import Client from '#models/client'
import Gateway from '#models/gateway'
import Product from '#models/product'
import Transaction from '#models/transaction'
import hash from '@adonisjs/core/services/hash'
import { GatewayRegistry } from '../../app/payment_gateways/gateway_registry.ts'
import { MakePaymentGateway } from '#tests/factories/make_payment_gateway'

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

async function createTransactionScenario(status: TransactionStatus = TransactionStatus.SUCCESSFUL) {
  const gateway = await Gateway.create({ name: 'gateway1', isActive: true, priority: 1 })
  const clientRecord = await Client.create({ name: 'Test Client', email: 'client@test.com' })
  const product = await Product.create({ name: 'Test Product', amount: 1000 })

  const transaction = await Transaction.create({
    clientId: clientRecord.id,
    gatewayId: gateway.id,
    externalId: 'ext-123',
    status,
    amount: 1000,
    cardLastNumbers: '1111',
  })

  await transaction.related('products').attach({ [product.id]: { quantity: 1 } })

  return { gateway, transaction }
}

test.group('Refund E2E', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.each.setup(async () => {
    await truncateAll()
  })

  test('should refund a transaction successfully as FINANCE', async ({ client }) => {
    const { gateway, transaction } = await createTransactionScenario()
    const user = await User.create({
      email: 'finance@test.com',
      password: await hash.make('password123'),
      role: Roles.FINANCE,
    })

    const registry = await app.container.make(GatewayRegistry)
    registry.register(gateway.name, MakePaymentGateway({ shouldSucceed: true }))

    const response = await client
      .post(`/transactions/${transaction.id}/refund`)
      .loginAs(user)
      .json({ reason: 'Produto com defeito' })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Transaction refunded successfully' })
  })

  test('should return 409 when transaction is already refunded', async ({ client }) => {
    const { gateway, transaction } = await createTransactionScenario(TransactionStatus.REFUNDED)
    const user = await User.create({
      email: 'finance@test.com',
      password: await hash.make('password123'),
      role: Roles.FINANCE,
    })

    const registry = await app.container.make(GatewayRegistry)
    registry.register(gateway.name, MakePaymentGateway({ shouldSucceed: true }))

    const response = await client
      .post(`/transactions/${transaction.id}/refund`)
      .loginAs(user)
      .json({ reason: 'Tentando reembolsar novamente' })

    response.assertStatus(409)
  })

  test('should return 409 when transaction has status FAILED', async ({ client }) => {
    const { gateway, transaction } = await createTransactionScenario(TransactionStatus.FAILED)
    const user = await User.create({
      email: 'finance@test.com',
      password: await hash.make('password123'),
      role: Roles.FINANCE,
    })

    const registry = await app.container.make(GatewayRegistry)
    registry.register(gateway.name, MakePaymentGateway({ shouldSucceed: true }))

    const response = await client
      .post(`/transactions/${transaction.id}/refund`)
      .loginAs(user)
      .json({ reason: 'Tentando reembolsar transação falha' })

    response.assertStatus(409)
  })

  test('should return 401 when USER tries to refund', async ({ client }) => {
    const { transaction } = await createTransactionScenario()
    const user = await User.create({
      email: 'user@test.com',
      password: await hash.make('password123'),
      role: Roles.USER,
    })

    const response = await client
      .post(`/transactions/${transaction.id}/refund`)
      .loginAs(user)
      .json({ reason: 'Tentativa sem permissão' })

    response.assertStatus(401)
  })
})
