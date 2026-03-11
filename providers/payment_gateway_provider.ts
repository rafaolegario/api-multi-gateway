import type { ApplicationService } from '@adonisjs/core/types'

import { GatewayRegistry } from '../app/payment_gateways/gateway_registry.ts'
import { Gateway2 } from '../app/payment_gateways/gateway_2.ts'

export default class PaymentGatewayProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(GatewayRegistry, () => {
      const registry = new GatewayRegistry()

      registry.register('gateway2', new Gateway2())

      return registry
    })
  }
}
