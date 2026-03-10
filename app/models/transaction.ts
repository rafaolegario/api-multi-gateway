import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Client from './client.js'
import Gateway from './gateway.js'
import Product from './product.js'
import { TransactionStatus } from '#enums/transaction_status'

export default class Transaction extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare clientId: string

  @column()
  declare gatewayId: string

  @column()
  declare externalId: string | null

  @column()
  declare status: TransactionStatus

  @column()
  declare amount: number

  @column()
  declare cardLastNumbers: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  @manyToMany(() => Product, {
    pivotTable: 'transaction_products',
    pivotColumns: ['quantity'],
    pivotTimestamps: true,
  })
  declare products: ManyToMany<typeof Product>

  @beforeCreate()
  static assignUuid(transaction: Transaction) {
    if (!transaction.id) {
      transaction.id = randomUUID()
    }
  }
}
