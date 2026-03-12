import vine from '@vinejs/vine'
import { TransactionStatus } from '#enums/transaction_status'

export const listTransactionsQuery = vine.create({
  page: vine.number().min(1),
  limit: vine.number().min(1).max(100),
  clientId: vine.string().uuid().optional(),
  gatewayId: vine.string().uuid().optional(),
  status: vine.enum(TransactionStatus).optional(),
  startDate: vine.date().optional(),
  endDate: vine.date().optional(),
})

export const getTransactionParams = vine.create({
  id: vine.string().uuid(),
})

export const refundTransactionParams = vine.create({
  id: vine.string().uuid(),
})

export const refundTransactionBody = vine.create({
  reason: vine.string().minLength(3),
})
