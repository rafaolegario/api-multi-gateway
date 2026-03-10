import { type TransactionStatus } from '#enums/transaction_status'
import type Transaction from '#models/transaction'
import { type PaginationParams, type PaginatedResult } from '../../types/pagination_types.ts'

export interface CreateTransactionData {
  clientId: number
  gatewayId: number
  amount: number
  cardLastNumbers?: string
  products: Array<{ productId: number; quantity: number }>
}

export interface TransactionFilters {
  clientId?: number
  gatewayId?: number
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
    clientId: number,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Transaction>>
  abstract create(data: CreateTransactionData): Promise<Transaction>
  abstract updateStatus(
    id: string,
    status: TransactionStatus,
    externalId?: string
  ): Promise<Transaction>
  abstract delete(id: string): Promise<void>
}
