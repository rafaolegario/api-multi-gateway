import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gateway from '#models/gateway'

export default class PaymentGatewaysSeeder extends BaseSeeder {
  public async run() {
    const exists = await Gateway.query().whereIn('name', ['gateway1', 'gateway2'])
    if (exists.length === 0) {
      await Gateway.createMany([
        {
          name: 'gateway1',
          isActive: true,
          priority: 1,
        },
        {
          name: 'gateway2',
          isActive: true,
          priority: 2,
        },
      ])
    }
  }
}
