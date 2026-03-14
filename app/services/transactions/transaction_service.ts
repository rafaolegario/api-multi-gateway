import { TransactionStatus } from '#enums/transaction_status'
import type Transaction from '#models/transaction'
import { type GatewayRepository } from '#repositories/contracts/gateway_repository'
import {
  type TransactionFilters,
  type TransactionRepository,
} from '#repositories/contracts/transaction_repository'
import { NotAllowedException } from '#services/errors/not_allowed_exception'
import { ResourceNotFoundException } from '#services/errors/resource_not_found_exception'
import { UnavailabilityServiceException } from '#services/errors/unavailability_service_exception'
import { type GatewayRegistry } from '../../payment_gateways/gateway_registry.ts'
import { type PaymentGateway } from '../../payment_gateways/payment_gateway_contract.ts'
import { type PaginationParams } from '../../types/pagination_types.ts'
import { type RefundTransactionDTO, type GetTransactionDTO } from './transaction_dto.ts'

const UNAVAILABILITY_MESSAGE = 'Refund process failed, please try again later'

export class TransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private gatewayRepository: GatewayRepository,
    private gatewayRegistry: GatewayRegistry
  ) {}

  async listTransactions(pagination: PaginationParams, filters?: TransactionFilters) {
    return await this.transactionRepository.findAll(pagination, filters)
  }

  async getTransaction(data: GetTransactionDTO) {
    const { id } = data
    const transaction = await this.transactionRepository.findById(id)

    if (!transaction) {
      throw new ResourceNotFoundException(`Transaction with ${id} not found`)
    }
    return transaction
  }

  async refundTransaction(data: RefundTransactionDTO) {
    const { id, reason } = data
    const transaction = await this.transactionRepository.findById(id)

    if (!transaction) {
      throw new ResourceNotFoundException(`Transaction with ${id} not found`)
    }

    await this.verifyTransactionStatus(transaction)

    let paymentGateway: PaymentGateway
    try {
      paymentGateway = await this.getTransactionGateway(transaction.gatewayId)
    } catch {
      throw new UnavailabilityServiceException(UNAVAILABILITY_MESSAGE, { status: 503 })
    }

    await this.processRefund(transaction, paymentGateway)

    transaction.status = TransactionStatus.REFUNDED
    transaction.reason = reason
    await this.transactionRepository.update(transaction)

    return { message: 'Transaction refunded successfully' }
  }

  private async processRefund(transaction: Transaction, paymentGateway: PaymentGateway) {
    const refund = await paymentGateway.refund({
      transactionId: transaction.externalId!,
    })
    if (!refund.success) {
      throw new UnavailabilityServiceException(UNAVAILABILITY_MESSAGE, {
        status: 503,
      })
    }
  }

  private async getTransactionGateway(gatewayId: string) {
    const gateway = await this.gatewayRepository.findById(gatewayId)
    if (!gateway) {
      throw new ResourceNotFoundException('Gateway not found')
    }

    const paymentGateway = this.gatewayRegistry.get(gateway.name)
    if (!paymentGateway) {
      throw new ResourceNotFoundException('Payment gateway not found')
    }

    return paymentGateway
  }

  private async verifyTransactionStatus(transaction: Transaction) {
    switch (transaction.status) {
      case TransactionStatus.SUCCESSFUL:
        return true
      case TransactionStatus.FAILED:
        throw new NotAllowedException(
          `Only successful transactions can be refunded. Transaction ${transaction.id} has status failed`,
          { status: 409 }
        )
      case TransactionStatus.REFUNDED:
        throw new NotAllowedException(`Transaction ${transaction.id} has already been refunded`, {
          status: 409,
        })
    }
  }
}
