import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'authenticate.login': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'authenticate.login': { paramsTuple?: []; params?: {} }
  }
  GET: {
  }
  HEAD: {
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}