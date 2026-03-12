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
}
