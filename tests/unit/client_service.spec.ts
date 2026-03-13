import { test } from '@japa/runner'
import { ClientService } from '#services/clients/client_service'
import { InMemoryClientRepository } from '../../app/repositories/in-memory-test/in_memory_client_repository.ts'
import { MakeClient } from '#tests/factories/make_client'
import { InMemoryTransactionRepository } from '#repositories/in-memory-test/in_memory_transaction_repository'
import { MakeTransaction } from '#tests/factories/make_transaction'

test.group('ClientService', (group) => {
  let clientService: ClientService
  let inMemoryClientRepository: InMemoryClientRepository
  let inMemoryTransactionRepository: InMemoryTransactionRepository

  group.each.setup(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    clientService = new ClientService(inMemoryClientRepository, inMemoryTransactionRepository)
  })

  test('should list all clients with pagination', async ({ assert }) => {
    const client1 = MakeClient()
    const client2 = MakeClient()
    const client3 = MakeClient()

    inMemoryClientRepository.clients.push(client1, client2, client3)

    const result = await clientService.ListClients({ page: 1, limit: 10 })

    assert.equal(result.total, 3)
    assert.equal(result.data.length, 3)
    assert.equal(result.page, 1)
    assert.equal(result.limit, 10)
  })

  test('should paginate clients correctly', async ({ assert }) => {
    const client1 = MakeClient()
    const client2 = MakeClient()
    const client3 = MakeClient()

    inMemoryClientRepository.clients.push(client1, client2, client3)

    const result = await clientService.ListClients({ page: 1, limit: 2 })

    assert.equal(result.total, 3)
    assert.equal(result.data.length, 2)
    assert.equal(result.lastPage, 2)
  })

  test('should throw an error when client is not found', async ({ assert }) => {
    const clientId = 'non-existent-id'

    await assert.rejects(
      () =>
        clientService.getClientAndTransactions({ clientId, pagination: { page: 1, limit: 10 } }),
      `Client with id ${clientId} not found`
    )
  })

  test('should get client and empty purchase data', async ({ assert }) => {
    const client = MakeClient()
    inMemoryClientRepository.clients.push(client)
    const result = await clientService.getClientAndTransactions({
      clientId: client.id,
      pagination: { page: 1, limit: 10 },
    })

    assert.equal(result.client.id, client.id)
    assert.equal(result.transactions.data.length, 0)
  })

  test('should get client and purchase data', async ({ assert }) => {
    const client = MakeClient()
    inMemoryClientRepository.clients.push(client)

    for (let i = 0; i < 5; i++) {
      const transaction = MakeTransaction({ clientId: client.id })
      inMemoryTransactionRepository.transactions.push(transaction)
    }

    const result = await clientService.getClientAndTransactions({
      clientId: client.id,
      pagination: { page: 1, limit: 10 },
    })

    assert.equal(result.client.id, client.id)
    assert.equal(result.transactions.data.length, 5)
  })

  test('should paginate purchase data correctly', async ({ assert }) => {
    const client = MakeClient()
    inMemoryClientRepository.clients.push(client)

    for (let i = 0; i < 11; i++) {
      const transaction = MakeTransaction({ clientId: client.id })
      inMemoryTransactionRepository.transactions.push(transaction)
    }

    const result = await clientService.getClientAndTransactions({
      clientId: client.id,
      pagination: { page: 2, limit: 10 },
    })

    assert.equal(result.client.id, client.id)
    assert.equal(result.transactions.data.length, 1)
    assert.equal(result.transactions.lastPage, 2)
    assert.equal(result.transactions.page, 2)
  })
})
