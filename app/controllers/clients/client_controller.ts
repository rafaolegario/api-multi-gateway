import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import TransactionTransformer from '#transformers/transaction_transform'
import { ClientService } from '#services/clients/client_service'
import ClientTransformer from '#transformers/client_transform'
import {
  getClientParams,
  listClientsQuery,
  listClientTransactionsQuery,
} from '#validators/client_validator'

@inject()
export default class ClientsController {
  constructor(private clientService: ClientService) {}

  async listClients({ request }: HttpContext) {
    const { page, limit } = await request.validateUsing(listClientsQuery)

    const result = await this.clientService.ListClients({
      limit,
      page,
    })

    return {
      clients: ClientTransformer.collection(result.data),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        lastPage: result.lastPage,
      },
    }
  }

  async getClientAndTransactions({ request }: HttpContext) {
    const { id } = await request.validateUsing(getClientParams, {
      data: request.params(),
    })

    const { page, limit } = await request.validateUsing(listClientTransactionsQuery)

    const result = await this.clientService.getClientAndTransactions({
      clientId: id,
      pagination: {
        page: page,
        limit: limit,
      },
    })

    return {
      client: new ClientTransformer(result.client).toObject(),
      transactions: {
        data: TransactionTransformer.collection(result.transactions.data),
        pagination: {
          total: result.transactions.total,
          page: result.transactions.page,
          limit: result.transactions.limit,
          lastPage: result.transactions.lastPage,
        },
      },
    }
  }
}
