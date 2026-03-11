import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE')
      table
        .uuid('gateway_id')
        .notNullable()
        .references('id')
        .inTable('gateways')
        .onDelete('CASCADE')
      table.string('external_id').nullable()
      table.string('status').notNullable().defaultTo('pending')
      table.integer('amount', 12).notNullable()
      table.string('card_last_numbers', 4).nullable()
      table.string('reason', 255).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
