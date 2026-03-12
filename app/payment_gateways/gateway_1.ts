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

const URL = env.get('GATEWAY_1_URL')
const AUTH_EMAIL = env.get('GATEWAY_1_EMAIL')
const AUTH_TOKEN = env.get('GATEWAY_1_TOKEN')

const headers = {
  'Content-Type': 'application/json',
  'Authorization': ``,
}

export class Gateway1 implements PaymentGateway {
  async login() {
    const response = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        email: AUTH_EMAIL,
        token: AUTH_TOKEN,
      }),
    })

    const data = (await response.json()) as { token: string }
    return (headers['Authorization'] = `Bearer ${data.token}`)
  }

  async charge(params: ProcessPaymentParams): Promise<ProcessPaymentResponse> {
    const body = {
      amount: params.amount,
      cardNumber: params.cardNumber,
      cvv: params.cvv,
      name: params.name,
      email: params.email,
    }

    await this.login()

    const response = await fetch(`${URL}/transactions`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
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
    throw new Error('Refund not implemented for Gateway 1')
  }
}
