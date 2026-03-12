import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { TransactionService } from '#services/transactions/transaction_service'
import TransactionTransformer from '#transformers/transaction_transform'
import {
  listTransactionsQuery,
  getTransactionParams,
  refundTransactionParams,
  refundTransactionBody,
} from '#validators/transactions_validator'

@inject()
export default class TransactionsController {
  constructor(private transactionService: TransactionService) {}

  async listTransactions({ request }: HttpContext) {
    const { page, limit, clientId, gatewayId, status } =
      await request.validateUsing(listTransactionsQuery)

    const result = await this.transactionService.listTransactions(
      { page, limit },
      { clientId, gatewayId, status }
    )

    return {
      transactions: TransactionTransformer.collection(result.data),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        lastPage: result.lastPage,
      },
    }
  }

  async getTransaction({ request }: HttpContext) {
    const { id } = await request.validateUsing(getTransactionParams, {
      data: request.params(),
    })

    const transaction = await this.transactionService.getTransaction({ id })

    return { transaction: new TransactionTransformer(transaction).toObject() }
  }

  async refundTransaction({ request }: HttpContext) {
    const { id } = await request.validateUsing(refundTransactionParams, {
      data: request.params(),
    })
    const { reason } = await request.validateUsing(refundTransactionBody)

    const result = await this.transactionService.refundTransaction({ id, reason })

    return result
  }
}
