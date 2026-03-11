export interface PurchaseDTO {
  name: string
  email: string
  cardNumber: string
  cvv: string
  products: Array<{
    id: string
    quantity: number
  }>
}

export interface PurchaseResponseDTO {
  success: boolean
  message: string
}

export interface ProcessPaymentDTO {
  name: string
  email: string
  cardNumber: string
  cvv: string
  amount: number
}

export interface ProcessPaymentResponseDTO {
  success: boolean
  gatewayId: string
  transactionId?: string
  errorMessage?: string
}
