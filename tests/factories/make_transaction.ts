import { TransactionStatus } from '#enums/transaction_status'
import Transaction from '#models/transaction'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export function MakeTransaction(override: Partial<Transaction> = {}): Transaction {
  const transaction = new Transaction()
  transaction.id = override.id ?? randomUUID()
  transaction.clientId = override.clientId ?? randomUUID()
  transaction.gatewayId = override.gatewayId ?? randomUUID()
  transaction.externalId = override.externalId ?? null
  transaction.status = override.status ?? TransactionStatus.SUCCESSFUL
  transaction.amount = override.amount ?? faker.number.int({ min: 100, max: 10000 })
  transaction.cardLastNumbers =
    override.cardLastNumbers ?? faker.finance.creditCardNumber().slice(-4)
  transaction.reason = override.reason ?? null
  transaction.createdAt = override.createdAt ?? DateTime.now()
  transaction.updatedAt = override.updatedAt ?? null
  transaction.$isPersisted = true

  return transaction
}
