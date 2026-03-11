import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transction'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('reason', 255).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('reason')
    })
  }
}
