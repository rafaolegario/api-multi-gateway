import type Client from '#models/client'
import { type AllClients } from '#repositories/contracts/client_repository'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ClientTransformer extends BaseTransformer<Client> {
  toObject() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    }
  }

  static collection(resources: AllClients[]) {
    return resources.map((resource) => ({
      id: resource.id,
      name: resource.name,
      email: resource.email,
    }))
  }
}
