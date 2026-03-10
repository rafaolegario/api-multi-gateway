import { Roles } from '#enums/roles'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AdminUserSeeder extends BaseSeeder {
  public async run() {
    const exists = await User.query().where('email', 'admin@betalent.com').first()
    if (!exists) {
      await User.create({
        email: 'admin@betalent.com',
        password: await hash.make('admin123'),
        role: Roles.ADMIN,
      })
    }
  }
}
