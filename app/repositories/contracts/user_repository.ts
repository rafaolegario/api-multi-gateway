import { type Roles } from '#enums/roles'
import type User from '#models/user'
import { type PaginatedResult, type PaginationParams } from '../../types/pagination_types.ts'

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
  abstract findAll(pagination: PaginationParams): Promise<PaginatedResult<User>>
  abstract update(user: User): Promise<User>
  abstract delete(id: string): Promise<void>
  abstract create(data: { email: string; password: string; role: Roles }): Promise<User>
}
