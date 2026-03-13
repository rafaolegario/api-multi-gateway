import type Client from '#models/client'
import { type PaginationParams, type PaginatedResult } from '../../types/pagination_types.ts'

export interface AllClients {
  id: string
  name: string
  email: string
}

export abstract class ClientRepository {
  abstract findById(id: string): Promise<Client | null>
  abstract findByEmail(email: string): Promise<Client | null>
  abstract findAll(pagination: PaginationParams): Promise<PaginatedResult<AllClients>>
  abstract create(data: { name: string; email: string }): Promise<Client>
  abstract update(client: Client): Promise<Client>
  abstract delete(id: string): Promise<void>
}
