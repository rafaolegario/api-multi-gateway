import { type TransactionStatus } from '#enums/transaction_status'
import type Transaction from '#models/transaction'
import { type PaginationParams, type PaginatedResult } from '../../types/pagination_types.ts'

export interface CreateTransactionData {
  clientId: string
  gatewayId: string
  amount: number
  cardLastNumbers?: string
  externalId?: string
  reason?: string
  status: TransactionStatus
  products: Array<{ id: string; quantity: number }>
}

export interface TransactionFilters {
  clientId?: string
  gatewayId?: string
  status?: TransactionStatus
  startDate?: Date
  endDate?: Date
}

export abstract class TransactionRepository {
  abstract findById(id: string): Promise<Transaction | null>
  abstract findAll(
    pagination: PaginationParams,
    filters?: TransactionFilters
  ): Promise<PaginatedResult<Transaction>>
  abstract findByClient(
    clientId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Transaction>>
  abstract update(transaction: Transaction): Promise<Transaction>
  abstract create(data: CreateTransactionData): Promise<Transaction>
}
