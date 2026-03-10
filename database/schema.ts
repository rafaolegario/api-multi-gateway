import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { Roles } from '#enums/roles'
import { TransactionStatus } from '#enums/transaction_status'

export class UserSchema extends BaseModel {
  static $columns = ['id', 'email', 'password', 'role', 'createdAt', 'updatedAt'] as const
  $columns = UserSchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare fullName: string | null
  @column()
  declare email: string
  @column({ serializeAs: null })
  declare password: string
  @column()
  declare role: Roles
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

export class GatewaySchema extends BaseModel {
  static $columns = ['id', 'name', 'isActive', 'priority', 'createdAt', 'updatedAt'] as const
  $columns = GatewaySchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string
  @column()
  declare isActive: boolean
  @column()
  declare priority: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

export class ClientSchema extends BaseModel {
  static $columns = ['id', 'name', 'email', 'createdAt', 'updatedAt'] as const
  $columns = ClientSchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string
  @column()
  declare email: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

export class ProductSchema extends BaseModel {
  static $columns = ['id', 'name', 'amount', 'createdAt', 'updatedAt'] as const
  $columns = ProductSchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string
  @column()
  declare amount: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

export class TransactionSchema extends BaseModel {
  static $columns = [
    'id',
    'clientId',
    'gatewayId',
    'externalId',
    'status',
    'amount',
    'cardLastNumbers',
    'createdAt',
    'updatedAt',
  ] as const
  $columns = TransactionSchema.$columns
  @column({ isPrimary: true })
  declare id: string
  @column()
  declare clientId: number
  @column()
  declare gatewayId: number
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
}

export class TransactionProductSchema extends BaseModel {
  static $columns = [
    'id',
    'transactionId',
    'productId',
    'quantity',
    'createdAt',
    'updatedAt',
  ] as const
  $columns = TransactionProductSchema.$columns
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare transactionId: string
  @column()
  declare productId: number
  @column()
  declare quantity: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
