import type Product from '#models/product'
import { type ProductRepository } from '#repositories/contracts/product_repository'
import { ResourceNotFoundException } from '#services/errors/resource_not_found_exception'
import { type PaginatedResult, type PaginationParams } from '../../types/pagination_types.ts'
import {
  type CreateProductDTO,
  type CreateProductResponseDTO,
  type UpdateProductDTO,
  type UpdateProductResponseDTO,
  type DeleteProductDTO,
  type DeleteProductResponseDTO,
  type GetProductByIdDTO,
} from './product_dto.ts'

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async listProducts(pagination: PaginationParams): Promise<PaginatedResult<Product>> {
    return await this.productRepository.findAll(pagination)
  }

  async getProductById(data: GetProductByIdDTO): Promise<Product> {
    const { id } = data
    return await this.verifyIfProductExistsById(id)
  }

  async createProduct(data: CreateProductDTO): Promise<CreateProductResponseDTO> {
    const { name, amount } = data

    const product = await this.productRepository.create({ name, price: amount })

    return { message: 'Product Created', product }
  }

  async updateProduct(data: UpdateProductDTO): Promise<UpdateProductResponseDTO> {
    const { id, name, amount } = data

    const product = await this.verifyIfProductExistsById(id)

    product.name = name ?? product.name
    product.amount = amount ?? product.amount

    const updatedProduct = await this.productRepository.update(product)

    return { message: 'Product Updated', product: updatedProduct }
  }

  async deleteProduct(data: DeleteProductDTO): Promise<DeleteProductResponseDTO> {
    const { id } = data

    await this.verifyIfProductExistsById(id)

    await this.productRepository.delete(id)

    return { message: 'Product Deleted' }
  }

  private async verifyIfProductExistsById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new ResourceNotFoundException(`Product with id ${id} not found`)
    }

    return product
  }
}
