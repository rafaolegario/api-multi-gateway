import { type ClientRepository } from '#repositories/contracts/client_repository'
import { type TransactionRepository } from '#repositories/contracts/transaction_repository'
import { ResourceNotFoundException } from '#services/errors/resource_not_found_exception'
import { type PaginationParams } from '../../types/pagination_types.ts'
import { type ClientAndTransactionsDTO } from './client_dto.ts'

export class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async ListClients(pagination: PaginationParams) {
    return this.clientRepository.findAll(pagination)
  }

  async getClientAndTransactions(data: ClientAndTransactionsDTO) {
    const { clientId, pagination } = data

    const client = await this.clientRepository.findById(clientId)

    if (!client) {
      throw new ResourceNotFoundException(`Client with id ${clientId} not found`)
    }

    const transactions = await this.transactionRepository.findAll(pagination, { clientId })

    return {
      client,
      transactions,
    }
  }
}
