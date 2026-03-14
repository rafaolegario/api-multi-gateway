import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import Gateway from '#models/gateway'
import Product from '#models/product'
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

test.group('Purchase E2E', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.each.setup(async () => {
    await truncateAll()
  })

  test('should complete a purchase successfully', async ({ client }) => {
    const gateway = await Gateway.create({ name: 'gateway1', isActive: true, priority: 1 })
    const product = await Product.create({ name: 'Test Product', amount: 1500 })

    const registry = await app.container.make(GatewayRegistry)
    registry.register(gateway.name, MakePaymentGateway({ shouldSucceed: true }))

    const response = await client.post('/purchase').json({
      name: 'Tester',
      email: 'tester@email.com',
      cardNumber: '4111111111111111',
      cvv: '123',
      products: [{ id: product.id, quantity: 2 }],
    })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Purchase completed successfully' })
  })

  test('should return 422 for invalid card data', async ({ client }) => {
    const product = await Product.create({ name: 'Test Product', amount: 1500 })

    const response = await client.post('/purchase').json({
      name: 'Tester',
      email: 'tester@email.com',
      cardNumber: '1234',
      cvv: '12',
      products: [{ id: product.id, quantity: 1 }],
    })

    response.assertStatus(422)
  })

  test('should return 503 when no active gateways exist', async ({ client }) => {
    const product = await Product.create({ name: 'Test Product', amount: 1500 })

    const response = await client.post('/purchase').json({
      name: 'Tester',
      email: 'tester@email.com',
      cardNumber: '4111111111111111',
      cvv: '123',
      products: [{ id: product.id, quantity: 1 }],
    })

    response.assertStatus(503)
  })

  test('should fallback to second gateway when first fails', async ({ client }) => {
    const gateway1 = await Gateway.create({ name: 'gateway1', isActive: true, priority: 1 })
    const gateway2 = await Gateway.create({ name: 'gateway2', isActive: true, priority: 2 })
    const product = await Product.create({ name: 'Test Product', amount: 1000 })

    const registry = await app.container.make(GatewayRegistry)
    registry.register(
      gateway1.name,
      MakePaymentGateway({ shouldSucceed: false, errorMessage: 'Gateway 1 failed' })
    )
    registry.register(gateway2.name, MakePaymentGateway({ shouldSucceed: true }))

    const response = await client.post('/purchase').json({
      name: 'Tester',
      email: 'tester@email.com',
      cardNumber: '4111111111111111',
      cvv: '123',
      products: [{ id: product.id, quantity: 1 }],
    })

    response.assertStatus(201)
    response.assertBodyContains({ message: 'Purchase completed successfully' })
  })

  test('should return 502 when all gateways fail', async ({ client }) => {
    const gateway1 = await Gateway.create({ name: 'gateway1', isActive: true, priority: 1 })
    const gateway2 = await Gateway.create({ name: 'gateway2', isActive: true, priority: 2 })
    const product = await Product.create({ name: 'Test Product', amount: 1000 })

    const registry = await app.container.make(GatewayRegistry)
    registry.register(
      gateway1.name,
      MakePaymentGateway({ shouldSucceed: false, errorMessage: 'Failed 1' })
    )
    registry.register(
      gateway2.name,
      MakePaymentGateway({ shouldSucceed: false, errorMessage: 'Failed 2' })
    )

    const response = await client.post('/purchase').json({
      name: 'Tester',
      email: 'tester@email.com',
      cardNumber: '4111111111111111',
      cvv: '123',
      products: [{ id: product.id, quantity: 1 }],
    })

    response.assertStatus(502)
  })
})
