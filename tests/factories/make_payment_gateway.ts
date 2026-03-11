import { randomUUID } from 'node:crypto'
import { type PaymentGateway } from '../../app/payment_gateways/payment_gateway_contract.ts'

interface MakePaymentGatewayOptions {
  shouldSucceed?: boolean
  transactionId?: string
  errorMessage?: string
}

export function MakePaymentGateway(options: MakePaymentGatewayOptions = {}): PaymentGateway {
  const { shouldSucceed = true, transactionId, errorMessage = 'Payment failed' } = options

  return {
    async charge() {
      if (shouldSucceed) {
        return {
          success: true,
          transactionId: transactionId ?? randomUUID(),
        }
      }
      return {
        success: false,
        error: errorMessage,
      }
    },

    async refund() {
      if (shouldSucceed) {
        return {
          success: true,
          transactionId: transactionId ?? randomUUID(),
        }
      }
      return {
        success: false,
        error: errorMessage,
      }
    },
  } as PaymentGateway
}
