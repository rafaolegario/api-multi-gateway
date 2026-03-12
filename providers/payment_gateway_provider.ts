import type { ApplicationService } from '@adonisjs/core/types'

import { GatewayRegistry } from '../app/payment_gateways/gateway_registry.ts'
import { Gateway2 } from '../app/payment_gateways/gateway_2.ts'
import { Gateway1 } from '../app/payment_gateways/gateway_1.ts'

export default class PaymentGatewayProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(GatewayRegistry, () => {
      const registry = new GatewayRegistry()

      registry.register('gateway1', new Gateway1())
      registry.register('gateway2', new Gateway2())

      return registry
    })
  }
}
