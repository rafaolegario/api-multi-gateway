import type Transaction from '#models/transaction'
import { type AllTrasactions } from '#repositories/contracts/transaction_repository'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class TransactionTransformer extends BaseTransformer<Transaction> {
  toObject() {
    return {
      id: this.resource.id,
      clientId: this.resource.clientId,
      gatewayId: this.resource.gatewayId,
      externalId: this.resource.externalId,
      status: this.resource.status,
      amount: this.resource.amount,
      cardLastNumbers: this.resource.cardLastNumbers,
      reason: this.resource.reason,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    }
  }

  static collection(resources: AllTrasactions[]) {
    return resources.map((resource) => ({
      id: resource.id,
      clientId: resource.clientId,
      status: resource.status,
      amount: resource.amount,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    }))
  }
}
