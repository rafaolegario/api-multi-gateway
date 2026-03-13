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
  'users.list_users': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.list_users']['types'],
  },
  'users.get_user': {
    methods: ["GET","HEAD"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.get_user']['types'],
  },
  'users.create_user': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.create_user']['types'],
  },
  'users.update_user': {
    methods: ["PUT"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update_user']['types'],
  },
  'users.delete_user': {
    methods: ["DELETE"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.delete_user']['types'],
  },
  'products.list_products': {
    methods: ["GET","HEAD"],
    pattern: '/products',
    tokens: [{"old":"/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.list_products']['types'],
  },
  'products.get_product': {
    methods: ["GET","HEAD"],
    pattern: '/products/:id',
    tokens: [{"old":"/products/:id","type":0,"val":"products","end":""},{"old":"/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.get_product']['types'],
  },
  'products.create_product': {
    methods: ["POST"],
    pattern: '/products',
    tokens: [{"old":"/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.create_product']['types'],
  },
  'products.update_product': {
    methods: ["PUT"],
    pattern: '/products/:id',
    tokens: [{"old":"/products/:id","type":0,"val":"products","end":""},{"old":"/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.update_product']['types'],
  },
  'products.delete_product': {
    methods: ["DELETE"],
    pattern: '/products/:id',
    tokens: [{"old":"/products/:id","type":0,"val":"products","end":""},{"old":"/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.delete_product']['types'],
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
