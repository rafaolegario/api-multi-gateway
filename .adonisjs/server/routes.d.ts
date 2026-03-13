import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'authenticate.login': { paramsTuple?: []; params?: {} }
    'purchase.purchase': { paramsTuple?: []; params?: {} }
    'gateways.list_gateways': { paramsTuple?: []; params?: {} }
    'gateways.toggle_is_active': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.change_priority': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.list_transactions': { paramsTuple?: []; params?: {} }
    'transactions.get_transaction': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.refund_transaction': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'client.list_clients': { paramsTuple?: []; params?: {} }
    'client.get_client_and_transactions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.list_users': { paramsTuple?: []; params?: {} }
    'users.get_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.create_user': { paramsTuple?: []; params?: {} }
    'users.update_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.delete_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.list_products': { paramsTuple?: []; params?: {} }
    'products.get_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.create_product': { paramsTuple?: []; params?: {} }
    'products.update_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.delete_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'authenticate.login': { paramsTuple?: []; params?: {} }
    'purchase.purchase': { paramsTuple?: []; params?: {} }
    'transactions.refund_transaction': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.create_user': { paramsTuple?: []; params?: {} }
    'products.create_product': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'gateways.list_gateways': { paramsTuple?: []; params?: {} }
    'transactions.list_transactions': { paramsTuple?: []; params?: {} }
    'transactions.get_transaction': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'client.list_clients': { paramsTuple?: []; params?: {} }
    'client.get_client_and_transactions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.list_users': { paramsTuple?: []; params?: {} }
    'users.get_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.list_products': { paramsTuple?: []; params?: {} }
    'products.get_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'gateways.list_gateways': { paramsTuple?: []; params?: {} }
    'transactions.list_transactions': { paramsTuple?: []; params?: {} }
    'transactions.get_transaction': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'client.list_clients': { paramsTuple?: []; params?: {} }
    'client.get_client_and_transactions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.list_users': { paramsTuple?: []; params?: {} }
    'users.get_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.list_products': { paramsTuple?: []; params?: {} }
    'products.get_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'gateways.toggle_is_active': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.change_priority': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'users.update_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.update_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'users.delete_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.delete_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}