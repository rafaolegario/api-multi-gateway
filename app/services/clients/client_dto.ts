import { type PaginationParams } from '../../types/pagination_types.ts'

export interface ClientAndTransactionsDTO {
  pagination: PaginationParams
  clientId: string
}
