import { type PaymentGateway } from './payment_gateway_contract.ts'

export class GatewayRegistry {
  private gateways = new Map<string, PaymentGateway>()

  register(name: string, gateway: PaymentGateway) {
    this.gateways.set(name, gateway)
  }

  get(name: string): PaymentGateway | undefined {
    const gateway = this.gateways.get(name)

    return gateway
  }
}
