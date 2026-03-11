import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class ProductSeeder extends BaseSeeder {
  public async run() {
    const exists = await Product.query().whereIn('name', ['product1', 'product2'])
    if (exists.length === 0) {
      await Product.createMany([
        {
          name: 'product1',
          amount: 1000,
        },
        {
          name: 'product2',
          amount: 2000,
        },
      ])
    }
  }
}
