import env from '#start/env'
import {
  type ProcessPaymentResponse,
  type PaymentGateway,
  type ProcessPaymentParams,
} from './payment_gateway_contract.ts'

interface ApiTransactionResponse {
  id?: string
  erros?: Array<{ message: string }>
}

const URL = env.get('GATEWAY_2_URL')
const AUTH_TOKEN = env.get('GATEWAY_2_AUTH_TOKEN')
const AUTH_SECRET = env.get('GATEWAY_2_AUTH_SECRET')

const headers = {
  'Content-Type': 'application/json',
  'Gateway-Auth-Token': AUTH_TOKEN,
  'Gateway-Auth-Secret': AUTH_SECRET,
}

export class Gateway2 implements PaymentGateway {
  async charge(params: ProcessPaymentParams): Promise<ProcessPaymentResponse> {
    const response = await fetch(`${URL}/transacoes`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        valor: params.amount,
        numeroCartao: params.cardNumber,
        cvv: params.cvv,
        nome: params.name,
        email: params.email,
      }),
    })
    const data = (await response.json()) as ApiTransactionResponse

    if (data.erros && data.erros.length > 0) {
      return {
        success: false,
        errorMessage: data.erros?.[0]?.message ?? 'Payment declined',
      }
    }

    return { success: true, transactionId: data.id }
  }

  async refund(transactionId: string, amount: number): Promise<ProcessPaymentResponse> {
    throw new Error('Refund not implemented for Gateway 2')
  }
}
