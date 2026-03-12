import Gateway from '#models/gateway'
import { type GatewayRepository } from '#repositories/contracts/gateway_repository'
import { type PaginationParams, type PaginatedResult } from '../../types/pagination_types.ts'

export class LucidGatewayRepository implements GatewayRepository {
  async findById(id: string): Promise<Gateway | null> {
    return await Gateway.find(id)
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Gateway>> {
    const { page, limit } = pagination
    const result = await Gateway.query().paginate(page, limit)
    const data = result.all()

    return {
      data,
      total: result.total,
      page: result.currentPage,
      limit: result.perPage,
      lastPage: result.lastPage,
    }
  }

  async findOrdenedByPriorityAndIsActive(): Promise<Gateway[]> {
    return await Gateway.query().where('isActive', true).orderBy('priority', 'asc')
  }

  async findByPriority(priority: number): Promise<Gateway | null> {
    return await Gateway.query().where('priority', priority).first()
  }

  async update(gateway: Gateway): Promise<Gateway> {
    await gateway.save()
    return gateway
  }
}
