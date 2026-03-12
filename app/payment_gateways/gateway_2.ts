import env from '#start/env'
import {
  type ProcessPaymentResponse,
  type PaymentGateway,
  type ProcessPaymentParams,
  type ProcessRefundParams,
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
    const body = {
      valor: params.amount,
      numeroCartao: params.cardNumber,
      cvv: params.cvv,
      nome: params.name,
      email: params.email,
    }

    const response = await fetch(`${URL}/transacoes`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })

    const data = (await response.json()) as ApiTransactionResponse
    console.log('gateway2 status:', response.status, 'data:', data)

    if ((data.erros && data.erros.length > 0) || !response.ok) {
      return {
        success: false,
        errorMessage: data.erros?.[0]?.message ?? 'Payment declined',
      }
    }

    return { success: true, transactionId: data.id }
  }

  async refund(params: ProcessRefundParams): Promise<ProcessPaymentResponse> {
    const body = {
      id: params.transactionId,
    }

    const response = await fetch(`${URL}/transacoes/reembolso`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })

    const data = (await response.json()) as ApiTransactionResponse

    if ((data.erros && data.erros.length > 0) || !response.ok) {
      return {
        success: false,
        errorMessage: data.erros?.[0]?.message ?? 'Refund failed',
      }
    }

    return { success: true }
  }
}
