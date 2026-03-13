import Client from '#models/client'
import { type AllClients, type ClientRepository } from '#repositories/contracts/client_repository'
import { type PaginatedResult, type PaginationParams } from '../../types/index.ts'

export class LucidClientRepository implements ClientRepository {
  async findById(id: string): Promise<Client | null> {
    return await Client.find(id)
  }

  async findByEmail(email: string): Promise<Client | null> {
    return await Client.query().where('email', email).first()
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<AllClients>> {
    const { page, limit } = pagination
    const result = await Client.query().select('id', 'name', 'email').paginate(page, limit)
    const data = result.all()

    return {
      data,
      total: result.total,
      page: result.currentPage,
      limit: result.perPage,
      lastPage: result.lastPage,
    }
  }

  async create(data: { name: string; email: string }): Promise<Client> {
    const client = await Client.create({
      name: data.name,
      email: data.email,
    })

    return client
  }

  async update(client: Client): Promise<Client> {
    await client.save()
    return client
  }

  async delete(id: string): Promise<void> {
    const client = await Client.find(id)
    if (client) {
      await client.delete()
    }
  }
}
