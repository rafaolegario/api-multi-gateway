import type Product from '#models/product'
import { type PaginationParams, type PaginatedResult } from '../../types/pagination_types.ts'

export abstract class ProductRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract fetchByIds(ids: string[]): Promise<Product[]>
  abstract findAll(pagination: PaginationParams): Promise<PaginatedResult<Product>>
  abstract create(data: { name: string; price: number }): Promise<Product>
  abstract update(product: Product): Promise<Product>
  abstract delete(id: string): Promise<void>
}
