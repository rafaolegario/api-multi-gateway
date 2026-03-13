import vine from '@vinejs/vine'

export const listClientsQuery = vine.create({
  page: vine.number().min(1),
  limit: vine.number().min(1).max(100),
})

export const getClientParams = vine.create({
  id: vine.string().uuid(),
})

export const listClientTransactionsQuery = vine.create({
  page: vine.number().min(1),
  limit: vine.number().min(1).max(100),
})
