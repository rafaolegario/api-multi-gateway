import Transaction from '#models/transaction'
import db from '@adonisjs/lucid/services/db'
import {
  type TransactionRepository,
  type CreateTransactionData,
  type TransactionFilters,
} from '#repositories/contracts/transaction_repository'
import { type PaginatedResult, type PaginationParams } from '../../types/index.ts'

export class LucidTransactionRepository implements TransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    return await Transaction.find(id)
  }

  async findAll(
    pagination: PaginationParams,
    filters?: TransactionFilters
  ): Promise<PaginatedResult<Transaction>> {
    let query = Transaction.query()

    if (filters) {
      if (filters.clientId) {
        query = query.where('clientId', filters.clientId)
      }
      if (filters.gatewayId) {
        query = query.where('gatewayId', filters.gatewayId)
      } else if (filters.status) {
        query = query.where('status', filters.status)
      }
      if (filters.startDate) {
        query = query.where('createdAt', '>=', filters.startDate)
      }
      if (filters.endDate) {
        query = query.where('createdAt', '<=', filters.endDate)
      }
    }

    const result = await query.paginate(pagination.page, pagination.limit)
    const data = result.all()

    return {
      data,
      total: result.total,
      page: result.currentPage,
      limit: result.perPage,
      lastPage: result.lastPage,
    }
  }

  async findByClient(
    clientId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Transaction>> {
    return this.findAll(pagination, { clientId })
  }

  async update(transaction: Transaction): Promise<Transaction> {
    await transaction.save()
    return transaction
  }

  async create(data: CreateTransactionData): Promise<Transaction> {
    return await db.transaction(async (trx) => {
      const transaction = await Transaction.create(
        {
          clientId: data.clientId,
          gatewayId: data.gatewayId,
          amount: data.amount,
          cardLastNumbers: data.cardLastNumbers,
          externalId: data.externalId,
          reason: data.reason,
          status: data.status,
        },
        { client: trx }
      )

      const productsToAttach = Object.fromEntries(
        data.products.map((p) => [p.id, { quantity: p.quantity }])
      )
      await transaction.related('products').attach(productsToAttach, trx)

      return transaction
    })
  }
}
