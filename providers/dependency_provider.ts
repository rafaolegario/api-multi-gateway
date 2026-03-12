import type { ApplicationService } from '@adonisjs/core/types'
import { UserRepository } from '#repositories/contracts/user_repository'
import { LucidUserRepository } from '#repositories/lucid/lucid_user_repository'
import { TokenProvider } from '#services/auth/contracts/token_provider'
import { DbTokenProvider } from '#services/auth/db_token_provider'
import { AuthenticateService } from '#services/auth/authenticate_service'
import { GatewayRepository } from '#repositories/contracts/gateway_repository'
import { LucidGatewayRepository } from '#repositories/lucid/lucid_gateway_repository'
import { TransactionRepository } from '#repositories/contracts/transaction_repository'
import { LucidTransactionRepository } from '#repositories/lucid/lucid_transaction_repository'
import { ClientRepository } from '#repositories/contracts/client_repository'
import { LucidClientRepository } from '#repositories/lucid/lucid_client_repository'
import { ProductRepository } from '#repositories/contracts/product_repository'
import { LucidProductRepository } from '#repositories/lucid/lucid_product_repository'
import { PurchaseService } from '#services/purchase/purchase_service'
import { GatewayRegistry } from '../app/payment_gateways/gateway_registry.ts'
import { GatewayService } from '#services/gateways/gateway_service'
import { TransactionService } from '#services/transactions/transaction_service'

//Para fins do teste tecnico injetei tudo aqui, mas o ideal seria criar um provider específico para cada serviço para manter a organização e escalabilidade do projeto.
export default class DependencyProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(UserRepository, () => {
      return new LucidUserRepository()
    })

    this.app.container.singleton(TokenProvider, () => {
      return new DbTokenProvider()
    })

    this.app.container.singleton(GatewayRepository, () => {
      return new LucidGatewayRepository()
    })

    this.app.container.singleton(TransactionRepository, () => {
      return new LucidTransactionRepository()
    })

    this.app.container.singleton(ClientRepository, () => {
      return new LucidClientRepository()
    })

    this.app.container.singleton(ProductRepository, () => {
      return new LucidProductRepository()
    })

    this.app.container.singleton(GatewayRegistry, () => {
      return new GatewayRegistry()
    })

    this.app.container.singleton(GatewayService, async () => {
      const gatewayRepository = await this.app.container.make(GatewayRepository)

      return new GatewayService(gatewayRepository)
    })

    this.app.container.singleton(PurchaseService, async () => {
      const gatewayRepository = await this.app.container.make(GatewayRepository)
      const gatewayRegistry = await this.app.container.make(GatewayRegistry)
      const clientRepository = await this.app.container.make(ClientRepository)
      const productRepository = await this.app.container.make(ProductRepository)
      const transactionRepository = await this.app.container.make(TransactionRepository)

      return new PurchaseService(
        gatewayRepository,
        gatewayRegistry,
        clientRepository,
        productRepository,
        transactionRepository
      )
    })

    this.app.container.singleton(TransactionService, async () => {
      const transactionRepository = await this.app.container.make(TransactionRepository)
      const gatewayRepository = await this.app.container.make(GatewayRepository)
      const gatewayRegistry = await this.app.container.make(GatewayRegistry)

      return new TransactionService(transactionRepository, gatewayRepository, gatewayRegistry)
    })

    this.app.container.singleton(AuthenticateService, async () => {
      const userRepository = await this.app.container.make(UserRepository)
      const tokenProvider = await this.app.container.make(TokenProvider)
      return new AuthenticateService(userRepository, tokenProvider)
    })
  }
}
