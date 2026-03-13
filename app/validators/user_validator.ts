import vine from '@vinejs/vine'
import { Roles } from '#enums/roles'

export const listUsersQuery = vine.create({
  page: vine.number().min(1),
  limit: vine.number().min(1).max(100),
})

export const getUserParams = vine.create({
  id: vine.string().uuid(),
})

export const createUserBody = vine.create({
  email: vine.string().email().maxLength(254),
  password: vine.string().minLength(8).maxLength(32),
  role: vine.enum(Object.values(Roles)),
})

export const updateUserBody = vine.create({
  email: vine.string().email().maxLength(254).optional(),
  password: vine.string().minLength(8).maxLength(32).optional(),
  role: vine.enum(Object.values(Roles)).optional(),
})

export const deleteUserParams = vine.create({
  id: vine.string().uuid(),
})
