export interface ProcessPaymentParams {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface ProcessRefundParams {
  transactionId: string
}

export interface ProcessPaymentResponse {
  success: boolean
  transactionId?: string
  errorMessage?: string
}

export abstract class PaymentGateway {
  abstract charge(params: ProcessPaymentParams): Promise<ProcessPaymentResponse>

  abstract refund(params: ProcessRefundParams): Promise<ProcessPaymentResponse>
}
