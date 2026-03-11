import type Client from '#models/client'
import { type PaginatedResult, type PaginationParams } from '../../types/pagination_types.ts'
import { type ClientRepository } from '../contracts/client_repository.ts'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export class InMemoryClientRepository implements ClientRepository {
  public clients: Client[] = []

  async findById(id: string): Promise<Client | null> {
    return this.clients.find((client) => client.id === id) ?? null
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clients.find((client) => client.email === email) ?? null
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Client>> {
    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit
    const data = this.clients.slice(start, end)
    const total = this.clients.length
    const lastPage = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      lastPage,
    }
  }

  async create(data: { name: string; email: string }): Promise<Client> {
    const client = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    } as Client

    this.clients.push(client)
    return client
  }

  async update(client: Client): Promise<Client> {
    const index = this.clients.findIndex((c) => c.id === client.id)
    if (index !== -1) {
      client.updatedAt = DateTime.now()
      this.clients[index] = client
    }
    return client
  }

  async delete(id: string): Promise<void> {
    const index = this.clients.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.clients.splice(index, 1)
    }
  }
}
