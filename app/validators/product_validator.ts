import vine from '@vinejs/vine'

export const listProductsQuery = vine.create({
  page: vine.number().min(1),
  limit: vine.number().min(1).max(100),
})

export const getProductParams = vine.create({
  id: vine.string().uuid(),
})

export const createProductBody = vine.create({
  name: vine.string(),
  amount: vine.number().min(1),
})

export const updateProductBody = vine.create({
  name: vine.string().optional(),
  amount: vine.number().min(1).optional(),
})

export const deleteProductParams = vine.create({
  id: vine.string().uuid(),
})
