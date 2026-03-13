/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'authenticate.login': {
    methods: ["POST"]
    pattern: '/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/authenticate_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/authenticate_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'purchase.purchase': {
    methods: ["POST"]
    pattern: '/purchase'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/purchase_validator').purchaseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/purchase_validator').purchaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchase/purchase_controller').default['purchase']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchase/purchase_controller').default['purchase']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gateways.list_gateways': {
    methods: ["GET","HEAD"]
    pattern: '/gateways'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/gateways_validator').listGatewaysQuery)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/gateways/gateways_controller').default['listGateways']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/gateways/gateways_controller').default['listGateways']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gateways.toggle_is_active': {
    methods: ["PATCH"]
    pattern: '/gateways/:id/toggle'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gateways_validator').toggleIsActiveParams)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/gateways_validator').toggleIsActiveParams)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/gateways/gateways_controller').default['toggleIsActive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/gateways/gateways_controller').default['toggleIsActive']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gateways.change_priority': {
    methods: ["PATCH"]
    pattern: '/gateways/:id/change-priority'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gateways_validator').changePriorityParams)>|InferInput<(typeof import('#validators/gateways_validator').changePriorityBody)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/gateways_validator').changePriorityParams)>|InferInput<(typeof import('#validators/gateways_validator').changePriorityBody)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/gateways/gateways_controller').default['changePriority']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/gateways/gateways_controller').default['changePriority']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transactions.list_transactions': {
    methods: ["GET","HEAD"]
    pattern: '/transactions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/transactions_validator').listTransactionsQuery)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions/transactions_controller').default['listTransactions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions/transactions_controller').default['listTransactions']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transactions.get_transaction': {
    methods: ["GET","HEAD"]
    pattern: '/transactions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/transactions_validator').getTransactionParams)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions/transactions_controller').default['getTransaction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions/transactions_controller').default['getTransaction']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transactions.refund_transaction': {
    methods: ["POST"]
    pattern: '/transactions/:id/refund'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transactions_validator').refundTransactionParams)>|InferInput<(typeof import('#validators/transactions_validator').refundTransactionBody)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/transactions_validator').refundTransactionParams)>|InferInput<(typeof import('#validators/transactions_validator').refundTransactionBody)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions/transactions_controller').default['refundTransaction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions/transactions_controller').default['refundTransaction']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.list_clients': {
    methods: ["GET","HEAD"]
    pattern: '/clients'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/client_validator').listClientsQuery)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/clients/client_controller').default['listClients']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/clients/client_controller').default['listClients']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'client.get_client_and_transactions': {
    methods: ["GET","HEAD"]
    pattern: '/clients/:id/transactions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/client_validator').getClientParams)>|InferInput<(typeof import('#validators/client_validator').listClientTransactionsQuery)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/clients/client_controller').default['getClientAndTransactions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/clients/client_controller').default['getClientAndTransactions']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.list_users': {
    methods: ["GET","HEAD"]
    pattern: '/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/user_validator').listUsersQuery)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['listUsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['listUsers']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.get_user': {
    methods: ["GET","HEAD"]
    pattern: '/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/user_validator').getUserParams)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['getUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['getUser']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.create_user': {
    methods: ["POST"]
    pattern: '/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_validator').createUserBody)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user_validator').createUserBody)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['createUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['createUser']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.update_user': {
    methods: ["PUT"]
    pattern: '/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_validator').getUserParams)>|InferInput<(typeof import('#validators/user_validator').updateUserBody)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user_validator').getUserParams)>|InferInput<(typeof import('#validators/user_validator').updateUserBody)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['updateUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['updateUser']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.delete_user': {
    methods: ["DELETE"]
    pattern: '/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_validator').deleteUserParams)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user_validator').deleteUserParams)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['deleteUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users/users_controller').default['deleteUser']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'products.list_products': {
    methods: ["GET","HEAD"]
    pattern: '/products'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/product_validator').listProductsQuery)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['listProducts']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['listProducts']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'products.get_product': {
    methods: ["GET","HEAD"]
    pattern: '/products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/product_validator').getProductParams)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['getProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['getProduct']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'products.create_product': {
    methods: ["POST"]
    pattern: '/products'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product_validator').createProductBody)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/product_validator').createProductBody)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['createProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['createProduct']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'products.update_product': {
    methods: ["PUT"]
    pattern: '/products/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product_validator').getProductParams)>|InferInput<(typeof import('#validators/product_validator').updateProductBody)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/product_validator').getProductParams)>|InferInput<(typeof import('#validators/product_validator').updateProductBody)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['updateProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['updateProduct']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'products.delete_product': {
    methods: ["DELETE"]
    pattern: '/products/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product_validator').deleteProductParams)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/product_validator').deleteProductParams)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['deleteProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products/products_controller').default['deleteProduct']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
