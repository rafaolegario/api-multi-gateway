import type Product from '#models/product'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ProductTransformer extends BaseTransformer<Product> {
  toObject() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      amount: this.resource.amount,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    }
  }
  static collection(resources: Product[]) {
    return resources.map((resource) => new ProductTransformer(resource).toObject())
  }
}
