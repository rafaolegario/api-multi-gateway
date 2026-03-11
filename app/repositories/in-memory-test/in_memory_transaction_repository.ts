import { TransactionStatus } from '#enums/transaction_status'
import type Transaction from '#models/transaction'
import { type PaginatedResult, type PaginationParams } from '../../types/pagination_types.ts'
import {
  TransactionRepository,
  type CreateTransactionData,
  type TransactionFilters,
} from '../contracts/transaction_repository.ts'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export interface InMemoryTransactionProduct {
  id: string
  transactionId: string
  productId: string
  quantity: number
  createdAt: DateTime
  updatedAt: DateTime | null
}

export class InMemoryTransactionRepository extends TransactionRepository {
  public transactions: Transaction[] = []
  public transactionProducts: InMemoryTransactionProduct[] = []

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.find((transaction) => transaction.id === id) ?? null
  }

  async findAll(
    pagination: PaginationParams,
    filters?: TransactionFilters
  ): Promise<PaginatedResult<Transaction>> {
    let filtered = [...this.transactions]

    if (filters) {
      if (filters.clientId) {
        filtered = filtered.filter((t) => t.clientId === filters.clientId)
      }
      if (filters.gatewayId) {
        filtered = filtered.filter((t) => t.gatewayId === filters.gatewayId)
      }
      if (filters.status) {
        filtered = filtered.filter((t) => t.status === filters.status)
      }
      if (filters.startDate) {
        filtered = filtered.filter((t) => t.createdAt.toJSDate() >= filters.startDate!)
      }
      if (filters.endDate) {
        filtered = filtered.filter((t) => t.createdAt.toJSDate() <= filters.endDate!)
      }
    }

    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit
    const data = filtered.slice(start, end)
    const total = filtered.length
    const lastPage = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      lastPage,
    }
  }

  async findByClient(
    clientId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Transaction>> {
    return this.findAll(pagination, { clientId })
  }

  async create(data: CreateTransactionData): Promise<Transaction> {
    const now = DateTime.now()
    const transaction = {
      id: randomUUID(),
      clientId: data.clientId,
      gatewayId: data.gatewayId,
      amount: data.amount,
      cardLastNumbers: data.cardLastNumbers ?? null,
      status: TransactionStatus.SUCCESSFUL,
      externalId: null,
      reason: null,
      createdAt: now,
      updatedAt: now,
    } as Transaction

    this.transactions.push(transaction)

    // relaciona os produtos da transação
    if (Array.isArray(data.products)) {
      for (const prod of data.products) {
        this.transactionProducts.push({
          id: randomUUID(),
          transactionId: transaction.id,
          productId: prod.id,
          quantity: prod.quantity,
          createdAt: now,
          updatedAt: now,
        })
      }
    }

    return transaction
  }

  findProductsByTransactionId(transactionId: string) {
    return this.transactionProducts.filter((tp) => tp.transactionId === transactionId)
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    externalId?: string
  ): Promise<Transaction> {
    const transaction = this.transactions.find((t) => t.id === id)
    if (!transaction) {
      throw new Error(`Transaction with id ${id} not found`)
    }

    transaction.status = status
    if (externalId) {
      transaction.externalId = externalId
    }
    transaction.updatedAt = DateTime.now()

    return transaction
  }

  async delete(id: string): Promise<void> {
    const index = this.transactions.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.transactions.splice(index, 1)
    }
  }
}
