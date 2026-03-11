import { test } from '@japa/runner'
import { PurchaseService } from '#services/purchase/purchase_service'
import { InMemoryGatewayRepository } from '../../app/repositories/in-memory-test/in_memory_gateway_repository.ts'
import { InMemoryClientRepository } from '../../app/repositories/in-memory-test/in_memory_client_repository.ts'
import { InMemoryProductRepository } from '../../app/repositories/in-memory-test/in_memory_product_repository.ts'
import { InMemoryTransactionRepository } from '../../app/repositories/in-memory-test/in_memory_transaction_repository.ts'
import { MakeProduct } from '#tests/factories/make_product'
import { GatewayRegistry } from '../../app/payment_gateways/gateway_registry.ts'
import { UnavailabilityServiceException } from '#services/errors/unavaibility_service_exception'
import { MakeGateway } from '#tests/factories/make_gateway'
import { MakePaymentGateway } from '#tests/factories/make_payment_gateway'

test.group('PurchaseService', (group) => {
  let purchaseService: PurchaseService
  let inMemoryGatewayRepository: InMemoryGatewayRepository
  let inMemoryClientRepository: InMemoryClientRepository
  let inMemoryProductRepository: InMemoryProductRepository
  let inMemoryTransactionRepository: InMemoryTransactionRepository
  let gatewayRegistry: GatewayRegistry

  group.each.setup(() => {
    inMemoryGatewayRepository = new InMemoryGatewayRepository()
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    gatewayRegistry = new GatewayRegistry()

    purchaseService = new PurchaseService(
      inMemoryGatewayRepository,
      gatewayRegistry,
      inMemoryClientRepository,
      inMemoryProductRepository,
      inMemoryTransactionRepository
    )
  })

  test('should throw error when product does not exist', async ({ assert }) => {
    const product = MakeProduct()

    inMemoryProductRepository.products.push(product)

    await assert.rejects(
      () =>
        purchaseService.purchase({
          cardNumber: '4111111111111111',
          cvv: '123',
          email: 'test@example.com',
          name: 'Test User',
          products: [
            { id: product.id, quantity: 1 },
            { id: 'non-existing-product-id', quantity: 1 },
          ],
        }),
      'Products with ids non-existing-product-id not found'
    )
  })

  test('should throw error when product have quantity less than 1', async ({ assert }) => {
    const product = MakeProduct()

    inMemoryProductRepository.products.push(product)

    await assert.rejects(
      () =>
        purchaseService.purchase({
          cardNumber: '4111111111111111',
          cvv: '123',
          email: 'test@example.com',
          name: 'Test User',
          products: [{ id: product.id, quantity: 0 }],
        }),
      'Product quantity must be at least 1'
    )
  })

  test('should throw error when cvv is invalid', async ({ assert }) => {
    const product = MakeProduct()

    inMemoryProductRepository.products.push(product)

    await assert.rejects(
      () =>
        purchaseService.purchase({
          cardNumber: '5569000040006063',
          cvv: '1234',
          email: 'test@example.com',
          name: 'Test User',
          products: [{ id: product.id, quantity: 1 }],
        }),
      'Invalid CVV format, must be 3 digits'
    )
  })

  test('should throw error when card number is invalid', async ({ assert }) => {
    const product = MakeProduct()

    inMemoryProductRepository.products.push(product)

    await assert.rejects(
      () =>
        purchaseService.purchase({
          cardNumber: '5569',
          cvv: '123',
          email: 'test@example.com',
          name: 'Test User',
          products: [{ id: product.id, quantity: 1 }],
        }),
      'Invalid card number format, must be 16 digits'
    )
  })

  test('should throw an error when there are no active gateways', async ({ assert }) => {
    const product = MakeProduct()

    inMemoryProductRepository.products.push(product)

    await assert.rejects(
      () =>
        purchaseService.purchase({
          cardNumber: '5569000040006063',
          cvv: '123',
          email: 'test@example.com',
          name: 'Test User',
          products: [{ id: product.id, quantity: 1 }],
        }),
      UnavailabilityServiceException
    )
  })

  test('should process payment successfully', async ({ assert }) => {
    const product = MakeProduct()
    const gateway = MakeGateway({ isActive: true, priority: 1 })

    inMemoryGatewayRepository.gateways.push(gateway)

    const paymentGateway = MakePaymentGateway()

    gatewayRegistry.register(gateway.name, paymentGateway)

    inMemoryProductRepository.products.push(product)

    const result = await purchaseService.purchase({
      cardNumber: '5569000040006063',
      cvv: '123',
      email: 'test@example.com',
      name: 'Test User',
      products: [{ id: product.id, quantity: 1 }],
    })

    assert.isTrue(result.success)
  })

  test('should not process payment successfully', async ({ assert }) => {
    const product = MakeProduct()
    const gateway = MakeGateway({ isActive: true, priority: 1 })

    inMemoryGatewayRepository.gateways.push(gateway)

    const paymentGateway = MakePaymentGateway({
      shouldSucceed: false,
      errorMessage: 'Payment failed',
    })

    gatewayRegistry.register(gateway.name, paymentGateway)

    inMemoryProductRepository.products.push(product)

    const result = await purchaseService.purchase({
      cardNumber: '5569000040006063',
      cvv: '123',
      email: 'test@example.com',
      name: 'Test User',
      products: [{ id: product.id, quantity: 1 }],
    })

    assert.isFalse(result.success)
  })

  test('Gateway 1 should process the payment successfully and stop calls to other gateways', async ({
    assert,
  }) => {
    const product = MakeProduct()

    const gateway1 = MakeGateway({ name: 'Gateway1', isActive: true, priority: 1 })
    const gateway2 = MakeGateway({ name: 'Gateway2', isActive: true, priority: 2 })

    inMemoryGatewayRepository.gateways.push(gateway1)
    inMemoryGatewayRepository.gateways.push(gateway2)

    const paymentGateway1 = MakePaymentGateway({
      shouldSucceed: true,
      errorMessage: 'Payment success',
    })

    const paymentGateway2 = MakePaymentGateway({
      shouldSucceed: true,
      errorMessage: 'Payment success',
    })

    gatewayRegistry.register(gateway1.name, paymentGateway1)
    gatewayRegistry.register(gateway2.name, paymentGateway2)

    inMemoryProductRepository.products.push(product)

    const result = await purchaseService.purchase({
      cardNumber: '5569000040006063',
      cvv: '123',
      email: 'test@example.com',
      name: 'Test User',
      products: [{ id: product.id, quantity: 1 }],
    })

    assert.isTrue(inMemoryTransactionRepository.transactions[0].gatewayId === gateway1.id)
    assert.isTrue(result.success)
  })

  test('Gateway 1 should fail but Gateway 2 should process the payment successfully', async ({
    assert,
  }) => {
    const product = MakeProduct()

    const gateway1 = MakeGateway({ name: 'Gateway1', isActive: true, priority: 1 })
    const gateway2 = MakeGateway({ name: 'Gateway2', isActive: true, priority: 2 })

    inMemoryGatewayRepository.gateways.push(gateway1)
    inMemoryGatewayRepository.gateways.push(gateway2)

    const paymentGateway1 = MakePaymentGateway({
      shouldSucceed: false,
      errorMessage: 'Payment failed',
    })

    const paymentGateway2 = MakePaymentGateway({
      shouldSucceed: true,
      errorMessage: 'Payment success',
    })

    gatewayRegistry.register(gateway1.name, paymentGateway1)
    gatewayRegistry.register(gateway2.name, paymentGateway2)

    inMemoryProductRepository.products.push(product)

    const result = await purchaseService.purchase({
      cardNumber: '5569000040006063',
      cvv: '123',
      email: 'test@example.com',
      name: 'Test User',
      products: [{ id: product.id, quantity: 1 }],
    })
    assert.equal(inMemoryTransactionRepository.transactions[0].gatewayId, gateway2.id)
    assert.isTrue(result.success)
  })

  test('When all gateways fail, should save the last gateway id in the transaction', async ({
    assert,
  }) => {
    const product = MakeProduct()

    const gateway1 = MakeGateway({ name: 'Gateway1', isActive: true, priority: 1 })
    const gateway2 = MakeGateway({ name: 'Gateway2', isActive: true, priority: 2 })

    inMemoryGatewayRepository.gateways.push(gateway1)
    inMemoryGatewayRepository.gateways.push(gateway2)

    const paymentGateway1 = MakePaymentGateway({
      shouldSucceed: false,
      errorMessage: 'Payment failed Gateway1',
    })

    const paymentGateway2 = MakePaymentGateway({
      shouldSucceed: false,
      errorMessage: 'Payment failed Gateway2',
    })

    gatewayRegistry.register(gateway1.name, paymentGateway1)
    gatewayRegistry.register(gateway2.name, paymentGateway2)

    inMemoryProductRepository.products.push(product)

    const result = await purchaseService.purchase({
      cardNumber: '5569000040006063',
      cvv: '123',
      email: 'test@example.com',
      name: 'Test User',
      products: [{ id: product.id, quantity: 1 }],
    })

    assert.isFalse(result.success)
    assert.equal(inMemoryTransactionRepository.transactions[0].gatewayId, gateway2.id)
  })

  test('should create a new client when client does not exist', async ({ assert }) => {
    const product = MakeProduct()
    const gateway = MakeGateway({ isActive: true, priority: 1 })

    inMemoryGatewayRepository.gateways.push(gateway)

    const paymentGateway = MakePaymentGateway()

    gatewayRegistry.register(gateway.name, paymentGateway)

    inMemoryProductRepository.products.push(product)

    const email = 'newclient@example.com'
    const name = 'New Client'

    await purchaseService.purchase({
      cardNumber: '5569000040006063',
      cvv: '123',
      email,
      name,
      products: [{ id: product.id, quantity: 1 }],
    })

    assert.equal(inMemoryClientRepository.clients.length, 1)
    assert.equal(inMemoryClientRepository.clients[0].email, email)
    assert.equal(inMemoryClientRepository.clients[0].name, name)
  })

  test('should find existing client instead of creating a new one', async ({ assert }) => {
    const product = MakeProduct()
    const gateway = MakeGateway({ isActive: true, priority: 1 })

    inMemoryGatewayRepository.gateways.push(gateway)

    const paymentGateway = MakePaymentGateway()

    gatewayRegistry.register(gateway.name, paymentGateway)

    inMemoryProductRepository.products.push(product)

    const existingEmail = 'existing@example.com'
    const existingName = 'Existing Client'

    await inMemoryClientRepository.create({ email: existingEmail, name: existingName })

    await purchaseService.purchase({
      cardNumber: '5569000040006063',
      cvv: '123',
      email: existingEmail,
      name: 'Different Name',
      products: [{ id: product.id, quantity: 1 }],
    })

    assert.equal(inMemoryClientRepository.clients.length, 1)
    assert.equal(inMemoryClientRepository.clients[0].email, existingEmail)
    assert.equal(inMemoryClientRepository.clients[0].name, existingName)
  })

  test('should create client and transaction with correct data', async ({ assert }) => {
    const product = MakeProduct({ amount: 100 })
    const gateway = MakeGateway({ isActive: true, priority: 1 })

    inMemoryGatewayRepository.gateways.push(gateway)

    const paymentGateway = MakePaymentGateway()

    gatewayRegistry.register(gateway.name, paymentGateway)

    inMemoryProductRepository.products.push(product)

    const email = 'complete@example.com'
    const name = 'Complete Test User'
    const cardNumber = '5569000040006063'

    const result = await purchaseService.purchase({
      cardNumber,
      cvv: '123',
      email,
      name,
      products: [{ id: product.id, quantity: 2 }],
    })

    assert.isTrue(result.success)

    assert.equal(inMemoryClientRepository.clients.length, 1)
    const createdClient = inMemoryClientRepository.clients[0]
    assert.equal(createdClient.email, email)
    assert.equal(createdClient.name, name)

    assert.equal(inMemoryTransactionRepository.transactions.length, 1)
    const createdTransaction = inMemoryTransactionRepository.transactions[0]
    assert.equal(createdTransaction.clientId, createdClient.id)
    assert.equal(createdTransaction.gatewayId, gateway.id)
    assert.equal(createdTransaction.amount, 20000) // 100 * 2 * 100 (cents)
    assert.equal(createdTransaction.cardLastNumbers, cardNumber.slice(-4))
  })
})
