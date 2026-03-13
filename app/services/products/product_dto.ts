import type Product from '#models/product'

export interface CreateProductDTO {
  name: string
  amount: number
}

export interface CreateProductResponseDTO {
  message: string
  product: Product
}

export interface UpdateProductDTO {
  id: string
  name?: string
  amount?: number
}

export interface UpdateProductResponseDTO {
  message: string
  product: Product
}

export interface DeleteProductDTO {
  id: string
}

export interface DeleteProductResponseDTO {
  message: string
}

export interface GetProductByIdDTO {
  id: string
}
