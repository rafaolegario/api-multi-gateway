import type Gateway from '#models/gateway'
import { type PaginatedResult, type PaginationParams } from '../../types/pagination_types.ts'
import { type GatewayRepository } from '../contracts/gateway_repository.ts'
import { DateTime } from 'luxon'

export class InMemoryGatewayRepository implements GatewayRepository {
  public gateways: Gateway[] = []

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Gateway>> {
    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit
    const data = this.gateways.slice(start, end)
    const total = this.gateways.length
    const lastPage = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      lastPage,
    }
  }

  async findOrdenedByPriorityAndIsActive(): Promise<Gateway[]> {
    return this.gateways
      .filter((gateway) => gateway.isActive)
      .sort((a, b) => a.priority - b.priority)
  }

  async update(gateway: Gateway): Promise<Gateway> {
    const index = this.gateways.findIndex((g) => g.id === gateway.id)
    if (index !== -1) {
      gateway.updatedAt = DateTime.now()
      this.gateways[index] = gateway
    }
    return gateway
  }
}
