import Product from '#models/product'
import { type ProductRepository } from '#repositories/contracts/product_repository'
import { type PaginatedResult, type PaginationParams } from '../../types/index.ts'

export class LucidProductRepository implements ProductRepository {
  async findById(id: string): Promise<Product | null> {
    return await Product.find(id)
  }

  async fetchByIds(ids: string[]): Promise<Product[]> {
    return await Product.query().whereIn('id', ids)
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Product>> {
    const { page, limit } = pagination
    const result = await Product.query().paginate(page, limit)
    const data = result.all()

    return {
      data,
      total: result.total,
      page: result.currentPage,
      limit: result.perPage,
      lastPage: result.lastPage,
    }
  }

  async create(data: { name: string; price: number }): Promise<Product> {
    const product = await Product.create({
      name: data.name,
      amount: data.price,
    })

    return product
  }

  async update(product: Product): Promise<Product> {
    await product.save()
    return product
  }

  async delete(id: string): Promise<void> {
    const product = await Product.find(id)
    if (product) {
      await product.delete()
    }
  }
}
