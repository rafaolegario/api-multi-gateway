import vine from '@vinejs/vine'

export const toggleIsActiveParams = vine.create({
  id: vine.string().uuid(),
})

export const changePriorityParams = vine.create({
  id: vine.string().uuid(),
})

export const changePriorityBody = vine.create({
  priority: vine.number().nonNegative().min(1),
})

export const listGatewaysQuery = vine.create({
  page: vine.number().nonNegative().min(1),
  limit: vine.number().nonNegative().min(1).max(100),
})
