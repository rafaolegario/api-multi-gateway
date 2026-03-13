import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { ProductService } from '#services/products/product_service'
import ProductTransformer from '#transformers/product_transform'
import {
  listProductsQuery,
  getProductParams,
  createProductBody,
  updateProductBody,
  deleteProductParams,
} from '#validators/product_validator'

@inject()
export default class ProductsController {
  constructor(private productService: ProductService) {}

  async listProducts({ request }: HttpContext) {
    const { page, limit } = await request.validateUsing(listProductsQuery)

    const paginatedResult = await this.productService.listProducts({
      page,
      limit,
    })

    return {
      products: ProductTransformer.collection(paginatedResult.data),
      pagination: {
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        lastPage: paginatedResult.lastPage,
      },
    }
  }

  async getProduct({ request }: HttpContext) {
    const { id } = await request.validateUsing(getProductParams, {
      data: request.params(),
    })

    const product = await this.productService.getProductById({ id })

    return { product: new ProductTransformer(product).toObject() }
  }

  async createProduct({ request }: HttpContext) {
    const { name, amount } = await request.validateUsing(createProductBody)

    const result = await this.productService.createProduct({ name, amount })

    return result
  }

  async updateProduct({ request }: HttpContext) {
    const { id } = await request.validateUsing(getProductParams, {
      data: request.params(),
    })
    const { name, amount } = await request.validateUsing(updateProductBody)

    const result = await this.productService.updateProduct({ id, name, amount })

    return result
  }

  async deleteProduct({ request }: HttpContext) {
    const { id } = await request.validateUsing(deleteProductParams, {
      data: request.params(),
    })

    const result = await this.productService.deleteProduct({ id })

    return result
  }
}
