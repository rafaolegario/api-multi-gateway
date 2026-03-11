import { type Roles } from '#enums/roles'
import type User from '#models/user'
import { type PaginatedResult, type PaginationParams } from '../../types/pagination_types.ts'
import { type UserRepository } from '../contracts/user_repository.ts'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<User>> {
    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit
    const data = this.users.slice(start, end)
    const total = this.users.length
    const lastPage = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      lastPage,
    }
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      user.updatedAt = DateTime.now()
      this.users[index] = user
    }
    return user
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
    }
  }

  async create(data: { email: string; password: string; role: Roles }): Promise<User> {
    const user = {
      id: randomUUID(),
      email: data.email,
      password: data.password,
      role: data.role,
      createdAt: DateTime.now(),
      updatedAt: null,
    } as User

    this.users.push(user)
    return user
  }

  clear(): void {
    this.users = []
  }
}
