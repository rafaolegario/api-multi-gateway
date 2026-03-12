import type Gateway from '#models/gateway'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class GatewaysTransformer extends BaseTransformer<Gateway> {
  toObject() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      isActive: Boolean(this.resource.isActive),
      priority: this.resource.priority,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    }
  }
  static collection(resources: Gateway[]) {
    return resources.map((resource) => new GatewaysTransformer(resource).toObject())
  }
}
