import { test } from '@japa/runner'
import { GatewayService } from '#services/gateways/gateway_service'
import { InMemoryGatewayRepository } from '../../app/repositories/in-memory-test/in_memory_gateway_repository.ts'
import { MakeGateway } from '#tests/factories/make_gateway'
import { ResourceNotFoundException } from '#services/errors/resource_not_found_exception'
import { NotAllowedException } from '#services/errors/not_allowed_exception'

test.group('GatewayService', (group) => {
  let gatewayService: GatewayService
  let inMemoryGatewayRepository: InMemoryGatewayRepository

  group.each.setup(() => {
    inMemoryGatewayRepository = new InMemoryGatewayRepository()
    gatewayService = new GatewayService(inMemoryGatewayRepository)
  })

  test('should list all gateways with pagination', async ({ assert }) => {
    const gateway1 = MakeGateway({ name: 'Gateway 1', isActive: true, priority: 1 })
    const gateway2 = MakeGateway({ name: 'Gateway 2', isActive: true, priority: 2 })
    const gateway3 = MakeGateway({ name: 'Gateway 3', isActive: false, priority: 3 })

    inMemoryGatewayRepository.gateways.push(gateway1, gateway2, gateway3)

    const result = await gatewayService.listGateways({ page: 1, limit: 10 })

    assert.equal(result.total, 3)
    assert.equal(result.data.length, 3)
    assert.equal(result.page, 1)
    assert.equal(result.limit, 10)
  })

  test('should paginate gateways correctly', async ({ assert }) => {
    const gateway1 = MakeGateway({ name: 'Gateway 1', isActive: true, priority: 1 })
    const gateway2 = MakeGateway({ name: 'Gateway 2', isActive: true, priority: 2 })
    const gateway3 = MakeGateway({ name: 'Gateway 3', isActive: false, priority: 3 })

    inMemoryGatewayRepository.gateways.push(gateway1, gateway2, gateway3)

    const result = await gatewayService.listGateways({ page: 1, limit: 2 })

    assert.equal(result.total, 3)
    assert.equal(result.data.length, 2)
    assert.equal(result.lastPage, 2)
  })

  test('should toggle gateway isActive from false to true', async ({ assert }) => {
    const gateway = MakeGateway({ isActive: false })

    inMemoryGatewayRepository.gateways.push(gateway)

    const updatedGateway = await gatewayService.toggleIsActive({
      gatewayId: gateway.id,
    })

    assert.equal(updatedGateway.isActive, true)
  })

  test('should toggle gateway isActive from true to false', async ({ assert }) => {
    const gateway = MakeGateway({ isActive: true })

    inMemoryGatewayRepository.gateways.push(gateway)

    const updatedGateway = await gatewayService.toggleIsActive({
      gatewayId: gateway.id,
    })

    assert.equal(updatedGateway.isActive, false)
  })

  test('should throw error when toggling isActive of non-existent gateway', async ({ assert }) => {
    await assert.rejects(
      () =>
        gatewayService.toggleIsActive({
          gatewayId: 'non-existent-id',
        }),
      ResourceNotFoundException
    )
  })

  test('should change gateway priority', async ({ assert }) => {
    const gateway = MakeGateway({ priority: 1 })

    inMemoryGatewayRepository.gateways.push(gateway)

    const updatedGateway = await gatewayService.changePriority({
      gatewayId: gateway.id,
      priority: 2,
    })

    assert.equal(updatedGateway.priority, 2)
  })

  test('should not update gateway if priority is already the same', async ({ assert }) => {
    const gateway = MakeGateway({ priority: 3 })

    inMemoryGatewayRepository.gateways.push(gateway)

    const updatedGateway = await gatewayService.changePriority({
      gatewayId: gateway.id,
      priority: 3,
    })

    assert.equal(updatedGateway.priority, 3)
    assert.isNull(updatedGateway.updatedAt)
  })

  test('should throw error when changing priority of non-existent gateway', async ({ assert }) => {
    await assert.rejects(
      () =>
        gatewayService.changePriority({
          gatewayId: 'non-existent-id',
          priority: 5,
        }),
      ResourceNotFoundException
    )
  })

  test('should throw error when priority is zero', async ({ assert }) => {
    const gateway = MakeGateway({ priority: 1 })

    inMemoryGatewayRepository.gateways.push(gateway)

    await assert.rejects(
      () =>
        gatewayService.changePriority({
          gatewayId: gateway.id,
          priority: 0,
        }),
      NotAllowedException
    )
  })

  test('should throw error when priority is negative', async ({ assert }) => {
    const gateway = MakeGateway({ priority: 1 })

    inMemoryGatewayRepository.gateways.push(gateway)

    await assert.rejects(
      () =>
        gatewayService.changePriority({
          gatewayId: gateway.id,
          priority: -1,
        }),
      NotAllowedException
    )
  })

  test('should throw error when priority is already in use', async ({ assert }) => {
    const gateway = MakeGateway({ priority: 1 })
    const gateway2 = MakeGateway({ priority: 3 })

    inMemoryGatewayRepository.gateways.push(gateway)
    inMemoryGatewayRepository.gateways.push(gateway2)

    await assert.rejects(
      () =>
        gatewayService.changePriority({
          gatewayId: gateway2.id,
          priority: 1,
        }),
      `Another gateway already has priority ${1}`
    )
  })
})
