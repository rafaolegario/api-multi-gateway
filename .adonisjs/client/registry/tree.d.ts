/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  authenticate: {
    login: typeof routes['authenticate.login']
  }
  purchase: {
    purchase: typeof routes['purchase.purchase']
  }
  gateways: {
    listGateways: typeof routes['gateways.list_gateways']
    toggleIsActive: typeof routes['gateways.toggle_is_active']
    changePriority: typeof routes['gateways.change_priority']
  }
  transactions: {
    listTransactions: typeof routes['transactions.list_transactions']
    getTransaction: typeof routes['transactions.get_transaction']
    refundTransaction: typeof routes['transactions.refund_transaction']
  }
  client: {
    listClients: typeof routes['client.list_clients']
    getClientAndTransactions: typeof routes['client.get_client_and_transactions']
  }
  users: {
    listUsers: typeof routes['users.list_users']
    getUser: typeof routes['users.get_user']
    createUser: typeof routes['users.create_user']
    updateUser: typeof routes['users.update_user']
    deleteUser: typeof routes['users.delete_user']
  }
  products: {
    listProducts: typeof routes['products.list_products']
    getProduct: typeof routes['products.get_product']
    createProduct: typeof routes['products.create_product']
    updateProduct: typeof routes['products.update_product']
    deleteProduct: typeof routes['products.delete_product']
  }
}
