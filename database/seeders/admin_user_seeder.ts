import { Roles } from '#enums/roles'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AdminUserSeeder extends BaseSeeder {
  public async run() {
    const exists = await User.query().where('email', 'admin@betalent.com').first()
    if (!exists) {
      await User.create({
        email: 'admin@betalent.com',
        password: 'admin123',
        role: Roles.ADMIN,
      })
    }
  }
}
