import type Gateway from '#models/gateway'
import { type PaginationParams, type PaginatedResult } from '../../types/pagination_types.ts'

export abstract class GatewayRepository {
  abstract findById(id: string): Promise<Gateway | null>
  abstract findByPriority(priority: number): Promise<Gateway | null>
  abstract findAll(pagination: PaginationParams): Promise<PaginatedResult<Gateway>>
  abstract findOrdenedByPriorityAndIsActive(): Promise<Gateway[]>
  abstract update(gateway: Gateway): Promise<Gateway>
}
