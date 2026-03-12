import { TransactionStatus } from '#enums/transaction_status'
import type Gateway from '#models/gateway'
import type Product from '#models/product'
import { type ClientRepository } from '#repositories/contracts/client_repository'
import { type GatewayRepository } from '#repositories/contracts/gateway_repository'
import { type ProductRepository, type TransactionRepository } from '#repositories/contracts/index'
import { NotAllowedException } from '#services/errors/not_allowed_exception'
import { ResourceNotFoundException } from '#services/errors/resource_not_found_exception'
import { UnavailabilityServiceException } from '#services/errors/unavaibility_service_exception'
import { type GatewayRegistry } from '../../payment_gateways/gateway_registry.ts'
import {
  type PurchaseResponseDTO,
  type ProcessPaymentDTO,
  type PurchaseDTO,
  type ProcessPaymentResponseDTO,
} from './purchase_dto.ts'

export class PurchaseService {
  constructor(
    private gatewayRepository: GatewayRepository,
    private gatewayRegistry: GatewayRegistry,
    private clientRepository: ClientRepository,
    private productRepository: ProductRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async purchase(data: PurchaseDTO): Promise<PurchaseResponseDTO> {
    const { products, cardNumber, cvv, email, name } = data

    this.validateCvvAndCardNumber(cvv, cardNumber)
    const amountInCents = await this.validateAndCalculateProductAmount(products)

    const { success, transactionId, errorMessage, gatewayId } = await this.processPayment({
      name: name,
      email: email,
      cardNumber,
      cvv,
      amount: amountInCents,
    })

    const client = await this.findOrCreateClient(email, name)

    await this.transactionRepository.create({
      clientId: client.id,
      gatewayId,
      amount: amountInCents,
      cardLastNumbers: cardNumber.slice(-4),
      externalId: transactionId ?? undefined,
      reason: errorMessage ?? undefined,
      status: success ? TransactionStatus.SUCCESSFUL : TransactionStatus.FAILED,
      products,
    })

    const ERROR_MESSAGE = 'Payment process failed, please try again later'
    const message = success ? 'Purchase completed successfully' : ERROR_MESSAGE

    return { success, message }
  }

  private async processPayment(data: ProcessPaymentDTO): Promise<ProcessPaymentResponseDTO> {
    const activeGateways = await this.verifyIfHasActiveGateway()

    let lastError = 'All gateways failed to process the payment'

    for (const gateway of activeGateways) {
      try {
        const paymentGateway = this.gatewayRegistry.get(gateway.name)
        if (paymentGateway) {
          const charge = await paymentGateway.charge(data)

          if (charge.success) {
            return { ...charge, gatewayId: gateway.id }
          }

          lastError = charge.errorMessage ?? lastError
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Gateway communication failed'
      }
    }

    return {
      success: false,
      errorMessage: lastError,
      gatewayId: activeGateways[activeGateways.length - 1].id,
    }
  }

  private async verifyIfHasActiveGateway(): Promise<Gateway[]> {
    const activeGateways = await this.gatewayRepository.findOrdenedByPriorityAndIsActive()

    if (activeGateways.length === 0) {
      throw new UnavailabilityServiceException(
        'Payment process is unavailable at the moment, please try again later',
        { status: 503 }
      )
    }

    return activeGateways
  }

  private validateCvvAndCardNumber(cvv: string, cardNumber: string): void {
    const cvvRegex = /^\d{3}$/
    const cardNumberRegex = /^\d{16}$/

    if (!cvvRegex.test(cvv)) {
      throw new NotAllowedException('Invalid CVV format, must be 3 digits', { status: 400 })
    }

    if (!cardNumberRegex.test(cardNumber)) {
      throw new NotAllowedException('Invalid card number format, must be 16 digits', {
        status: 400,
      })
    }
  }

  private async validateAndCalculateProductAmount(
    productsReq: PurchaseDTO['products']
  ): Promise<number> {
    this.validateProductQuantity(productsReq)

    const productIds = productsReq.map((p) => p.id)
    const products = await this.verifyIfProductExists(productIds)
    return this.calculateProductAmount(productsReq, products)
  }

  private calculateProductAmount(
    productsReq: PurchaseDTO['products'],
    Products: Product[]
  ): number {
    const productMap = new Map(Products.map((p) => [p.id, p]))

    const mappedProducts = productsReq.map((p) => {
      const product = productMap.get(p.id)
      return { ...p, amount: product ? product.amount : 0 }
    })

    return mappedProducts.reduce((total, p) => total + p.amount * p.quantity, 0)
  }

  private validateProductQuantity(products: PurchaseDTO['products']): void {
    const invalidProducts = products.filter((p) => p.quantity < 1)

    if (invalidProducts.length > 0) {
      throw new NotAllowedException('Product quantity must be at least 1')
    }
  }

  private async verifyIfProductExists(productIds: string[]): Promise<Product[]> {
    const products = await this.productRepository.fetchByIds(productIds)
    const foundProductIds = products.map((p) => p.id)

    const unFoundProductIds = productIds.filter((id) => !foundProductIds.includes(id))

    if (unFoundProductIds.length > 0) {
      throw new ResourceNotFoundException(
        `Products with ids ${unFoundProductIds.join(', ')} not found`
      )
    }

    return products
  }

  private async findOrCreateClient(email: string, name: string) {
    let client = await this.clientRepository.findByEmail(email)

    if (!client) {
      client = await this.clientRepository.create({ email, name })
    }

    return client
  }
}
