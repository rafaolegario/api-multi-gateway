import { test } from '@japa/runner'
import { TransactionService } from '#services/transactions/transaction_service'
import { InMemoryTransactionRepository } from '../../app/repositories/in-memory-test/in_memory_transaction_repository.ts'
import { InMemoryGatewayRepository } from '../../app/repositories/in-memory-test/in_memory_gateway_repository.ts'
import { GatewayRegistry } from '../../app/payment_gateways/gateway_registry.ts'
import { MakeTransaction } from '#tests/factories/make_transaction'
import { MakeGateway } from '#tests/factories/make_gateway'
import { MakePaymentGateway } from '#tests/factories/make_payment_gateway'
import { TransactionStatus } from '#enums/transaction_status'

test.group('TransactionService', (group) => {
  let transactionService: TransactionService
  let inMemoryTransactionRepository: InMemoryTransactionRepository
  let inMemoryGatewayRepository: InMemoryGatewayRepository
  let gatewayRegistry: GatewayRegistry

  group.each.setup(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    inMemoryGatewayRepository = new InMemoryGatewayRepository()
    gatewayRegistry = new GatewayRegistry()
    transactionService = new TransactionService(
      inMemoryTransactionRepository,
      inMemoryGatewayRepository,
      gatewayRegistry
    )
  })

  test('should list all transactions with pagination', async ({ assert }) => {
    const transaction1 = MakeTransaction()
    const transaction2 = MakeTransaction()
    const transaction3 = MakeTransaction()

    inMemoryTransactionRepository.transactions.push(transaction1, transaction2, transaction3)

    const result = await transactionService.listTransactions({ page: 1, limit: 10 })

    assert.equal(result.total, 3)
    assert.equal(result.data.length, 3)
    assert.equal(result.page, 1)
    assert.equal(result.limit, 10)
  })

  test('should paginate transactions correctly', async ({ assert }) => {
    const transaction1 = MakeTransaction()
    const transaction2 = MakeTransaction()
    const transaction3 = MakeTransaction()

    inMemoryTransactionRepository.transactions.push(transaction1, transaction2, transaction3)

    const result = await transactionService.listTransactions({ page: 1, limit: 2 })

    assert.equal(result.total, 3)
    assert.equal(result.data.length, 2)
    assert.equal(result.lastPage, 2)
  })

  test('should filter transactions by clientId', async ({ assert }) => {
    const clientId = 'client-123'
    const transaction1 = MakeTransaction({ clientId })
    const transaction2 = MakeTransaction({ clientId })
    const transaction3 = MakeTransaction()

    inMemoryTransactionRepository.transactions.push(transaction1, transaction2, transaction3)

    const result = await transactionService.listTransactions({ page: 1, limit: 10 }, { clientId })

    assert.equal(result.total, 2)
    assert.isTrue(result.data.every((t) => t.clientId === clientId))
  })

  test('should filter transactions by gatewayId', async ({ assert }) => {
    const gatewayId = 'gateway-abc'
    const transaction1 = MakeTransaction({ gatewayId })
    const transaction2 = MakeTransaction()

    inMemoryTransactionRepository.transactions.push(transaction1, transaction2)

    const result = await transactionService.listTransactions({ page: 1, limit: 10 }, { gatewayId })

    assert.equal(result.total, 1)
    assert.equal(result.data[0].id, transaction1.id)
  })

  test('should filter transactions by status', async ({ assert }) => {
    const transaction1 = MakeTransaction({ status: TransactionStatus.SUCCESSFUL })
    const transaction2 = MakeTransaction({ status: TransactionStatus.REFUNDED })
    const transaction3 = MakeTransaction({ status: TransactionStatus.FAILED })

    inMemoryTransactionRepository.transactions.push(transaction1, transaction2, transaction3)

    const result = await transactionService.listTransactions(
      { page: 1, limit: 10 },
      { status: TransactionStatus.REFUNDED }
    )

    assert.equal(result.total, 1)
    assert.equal(result.data[0].status, TransactionStatus.REFUNDED)
  })

  test('should get a transaction by id', async ({ assert }) => {
    const transaction = MakeTransaction()

    inMemoryTransactionRepository.transactions.push(transaction)

    const result = await transactionService.getTransaction({ id: transaction.id })

    assert.equal(result?.id, transaction.id)
  })

  test('should throw error when transaction not found by id', async ({ assert }) => {
    await assert.rejects(
      () =>
        transactionService.getTransaction({
          id: 'non-existent-id',
        }),
      `Transaction with non-existent-id not found`
    )
  })

  test('should refund a transaction', async ({ assert }) => {
    const gateway = MakeGateway({ name: 'Gateway1', isActive: true })
    const transaction = MakeTransaction({
      status: TransactionStatus.SUCCESSFUL,
      gatewayId: gateway.id,
    })

    inMemoryGatewayRepository.gateways.push(gateway)
    inMemoryTransactionRepository.transactions.push(transaction)
    gatewayRegistry.register(gateway.name, MakePaymentGateway({ shouldSucceed: true }))

    const result = await transactionService.refundTransaction({
      id: transaction.id,
      reason: 'Customer request',
    })

    assert.equal(result.message, 'Transaction refunded successfully')
  })

  test('should throw error when refund process fails on gateway', async ({ assert }) => {
    const gateway = MakeGateway({ name: 'Gateway1', isActive: true })
    const transaction = MakeTransaction({
      status: TransactionStatus.SUCCESSFUL,
      gatewayId: gateway.id,
    })

    inMemoryGatewayRepository.gateways.push(gateway)
    inMemoryTransactionRepository.transactions.push(transaction)
    gatewayRegistry.register(gateway.name, MakePaymentGateway({ shouldSucceed: false }))

    await assert.rejects(
      () =>
        transactionService.refundTransaction({
          id: transaction.id,
          reason: 'Customer request',
        }),
      `Refund process failed, please try again later`
    )
  })

  test('should throw error when refunding non-existent transaction', async ({ assert }) => {
    await assert.rejects(
      () =>
        transactionService.refundTransaction({
          id: 'non-existent-id',
          reason: 'Customer request',
        }),
      'Transaction with non-existent-id not found'
    )
  })

  test('should throw error when transaction status is failed', async ({ assert }) => {
    const transaction = MakeTransaction({ status: TransactionStatus.FAILED })

    inMemoryTransactionRepository.transactions.push(transaction)

    await assert.rejects(
      () =>
        transactionService.refundTransaction({
          id: transaction.id,
          reason: 'Customer request',
        }),
      `Only successful transactions can be refunded. Transaction ${transaction.id} has status failed`
    )
  })

  test('should throw error when transaction status is refunded', async ({ assert }) => {
    const transaction = MakeTransaction({ status: TransactionStatus.REFUNDED })

    inMemoryTransactionRepository.transactions.push(transaction)

    await assert.rejects(
      () =>
        transactionService.refundTransaction({
          id: transaction.id,
          reason: 'Customer request',
        }),
      `Transaction ${transaction.id} has already been refunded`
    )
  })
})
