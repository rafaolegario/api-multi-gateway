import Product from '#models/product'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export function MakeProduct(override: Partial<Product> = {}): Product {
  const product = new Product()
  product.id = override.id ?? randomUUID()
  product.name = override.name ?? faker.commerce.productName()
  product.amount = override.amount ?? faker.number.int({ min: 100, max: 10000 })
  product.createdAt = override.createdAt ?? DateTime.now()
  product.updatedAt = override.updatedAt ?? null
  product.$isPersisted = true

  return product
}
