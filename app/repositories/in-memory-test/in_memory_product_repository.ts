import type Product from '#models/product'
import { type PaginatedResult, type PaginationParams } from '../../types/pagination_types.ts'
import { ProductRepository } from '../contracts/product_repository.ts'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export class InMemoryProductRepository extends ProductRepository {
  public products: Product[] = []

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null
  }

  async fetchByIds(ids: string[]): Promise<Product[]> {
    return this.products.filter((product) => ids.includes(product.id))
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Product>> {
    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit
    const data = this.products.slice(start, end)
    const total = this.products.length
    const lastPage = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      lastPage,
    }
  }

  async create(data: { name: string; price: number }): Promise<Product> {
    const product = {
      id: randomUUID(),
      name: data.name,
      amount: data.price,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    } as Product

    this.products.push(product)
    return product
  }

  async update(product: Product): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === product.id)
    if (index !== -1) {
      product.updatedAt = DateTime.now()
      this.products[index] = product
    }
    return product
  }

  async delete(id: string): Promise<void> {
    const index = this.products.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.products.splice(index, 1)
    }
  }
}
