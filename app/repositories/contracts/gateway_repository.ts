import type Gateway from '#models/gateway'
import { type PaginationParams, type PaginatedResult } from '../../types/pagination_types.ts'

export abstract class GatewayRepository {
  abstract findById(id: number): Promise<Gateway | null>
  abstract findAll(pagination: PaginationParams): Promise<PaginatedResult<Gateway>>
  abstract findByPriorityAndIsActive(priority: number, isActive: boolean): Promise<Gateway[]>
  abstract update(gateway: Gateway): Promise<Gateway>
}
