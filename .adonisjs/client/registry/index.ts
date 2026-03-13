/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'authenticate.login': {
    methods: ["POST"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['authenticate.login']['types'],
  },
  'purchase.purchase': {
    methods: ["POST"],
    pattern: '/purchase',
    tokens: [{"old":"/purchase","type":0,"val":"purchase","end":""}],
    types: placeholder as Registry['purchase.purchase']['types'],
  },
  'gateways.list_gateways': {
    methods: ["GET","HEAD"],
    pattern: '/gateways',
    tokens: [{"old":"/gateways","type":0,"val":"gateways","end":""}],
    types: placeholder as Registry['gateways.list_gateways']['types'],
  },
  'gateways.toggle_is_active': {
    methods: ["PATCH"],
    pattern: '/gateways/:id/toggle',
    tokens: [{"old":"/gateways/:id/toggle","type":0,"val":"gateways","end":""},{"old":"/gateways/:id/toggle","type":1,"val":"id","end":""},{"old":"/gateways/:id/toggle","type":0,"val":"toggle","end":""}],
    types: placeholder as Registry['gateways.toggle_is_active']['types'],
  },
  'gateways.change_priority': {
    methods: ["PATCH"],
    pattern: '/gateways/:id/change-priority',
    tokens: [{"old":"/gateways/:id/change-priority","type":0,"val":"gateways","end":""},{"old":"/gateways/:id/change-priority","type":1,"val":"id","end":""},{"old":"/gateways/:id/change-priority","type":0,"val":"change-priority","end":""}],
    types: placeholder as Registry['gateways.change_priority']['types'],
  },
  'transactions.list_transactions': {
    methods: ["GET","HEAD"],
    pattern: '/transactions',
    tokens: [{"old":"/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['transactions.list_transactions']['types'],
  },
  'transactions.get_transaction': {
    methods: ["GET","HEAD"],
    pattern: '/transactions/:id',
    tokens: [{"old":"/transactions/:id","type":0,"val":"transactions","end":""},{"old":"/transactions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transactions.get_transaction']['types'],
  },
  'transactions.refund_transaction': {
    methods: ["POST"],
    pattern: '/transactions/:id/refund',
    tokens: [{"old":"/transactions/:id/refund","type":0,"val":"transactions","end":""},{"old":"/transactions/:id/refund","type":1,"val":"id","end":""},{"old":"/transactions/:id/refund","type":0,"val":"refund","end":""}],
    types: placeholder as Registry['transactions.refund_transaction']['types'],
  },
  'client.list_clients': {
    methods: ["GET","HEAD"],
    pattern: '/clients',
    tokens: [{"old":"/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['client.list_clients']['types'],
  },
  'client.get_client_and_transactions': {
    methods: ["GET","HEAD"],
    pattern: '/clients/:id/transactions',
    tokens: [{"old":"/clients/:id/transactions","type":0,"val":"clients","end":""},{"old":"/clients/:id/transactions","type":1,"val":"id","end":""},{"old":"/clients/:id/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['client.get_client_and_transactions']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
