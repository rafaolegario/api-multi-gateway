import { test } from '@japa/runner'
import { ProductService } from '#services/products/product_service'
import { InMemoryProductRepository } from '../../app/repositories/in-memory-test/in_memory_product_repository.ts'
import { MakeProduct } from '#tests/factories/make_product'
import { ResourceNotFoundException } from '#services/errors/resource_not_found_exception'

test.group('ProductService', (group) => {
  let productService: ProductService
  let inMemoryProductRepository: InMemoryProductRepository

  group.each.setup(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    productService = new ProductService(inMemoryProductRepository)
  })

  test('(LIST)should list all products with pagination', async ({ assert }) => {
    const product1 = MakeProduct({ name: 'Product 1', amount: 1000 })
    const product2 = MakeProduct({ name: 'Product 2', amount: 2000 })
    const product3 = MakeProduct({ name: 'Product 3', amount: 3000 })

    inMemoryProductRepository.products.push(product1, product2, product3)

    const result = await productService.listProducts({ page: 1, limit: 10 })

    assert.equal(result.total, 3)
    assert.equal(result.data.length, 3)
    assert.equal(result.page, 1)
    assert.equal(result.limit, 10)
  })

  test('(LIST)should paginate products correctly', async ({ assert }) => {
    const product1 = MakeProduct({ name: 'Product 1', amount: 1000 })
    const product2 = MakeProduct({ name: 'Product 2', amount: 2000 })
    const product3 = MakeProduct({ name: 'Product 3', amount: 3000 })

    inMemoryProductRepository.products.push(product1, product2, product3)

    const result = await productService.listProducts({ page: 1, limit: 2 })

    assert.equal(result.total, 3)
    assert.equal(result.data.length, 2)
    assert.equal(result.lastPage, 2)
  })

  test('(GET)should return product by id', async ({ assert }) => {
    const product = MakeProduct({ name: 'Product 1', amount: 1000 })
    inMemoryProductRepository.products.push(product)

    const result = await productService.getProductById({ id: product.id })

    assert.equal(result.id, product.id)
    assert.equal(result.name, 'Product 1')
    assert.equal(result.amount, 1000)
  })

  test('(GET)should throw error when product is not found', async ({ assert }) => {
    const productId = 'non-existent-id'

    await assert.rejects(
      () => productService.getProductById({ id: productId }),
      ResourceNotFoundException
    )
  })

  test('(CREATE)should create product', async ({ assert }) => {
    const result = await productService.createProduct({
      name: 'New Product',
      amount: 5000,
    })

    assert.equal(result.message, 'Product Created')
    assert.equal(result.product.name, 'New Product')
    assert.equal(result.product.amount, 5000)
    assert.equal(inMemoryProductRepository.products.length, 1)
  })

  test('(UPDATE)should update product', async ({ assert }) => {
    const product = MakeProduct({ name: 'Old Name', amount: 1000 })
    inMemoryProductRepository.products.push(product)

    const result = await productService.updateProduct({
      id: product.id,
      name: 'New Name',
      amount: 2000,
    })

    assert.equal(result.message, 'Product Updated')
    assert.equal(result.product.name, 'New Name')
    assert.equal(result.product.amount, 2000)
  })

  test('(UPDATE)should throw error when product is not found', async ({ assert }) => {
    const productId = 'non-existent-id'

    await assert.rejects(
      () =>
        productService.updateProduct({
          id: productId,
          name: 'New Name',
        }),
      ResourceNotFoundException
    )
  })

  test('(DELETE)should delete product', async ({ assert }) => {
    const product = MakeProduct({ name: 'Product 1', amount: 1000 })
    inMemoryProductRepository.products.push(product)

    const result = await productService.deleteProduct({ id: product.id })

    assert.equal(result.message, 'Product Deleted')
    assert.equal(inMemoryProductRepository.products.length, 0)
  })

  test('(DELETE)should throw error when product is not found', async ({ assert }) => {
    const productId = 'non-existent-id'

    await assert.rejects(
      () => productService.deleteProduct({ id: productId }),
      ResourceNotFoundException
    )
  })
})
