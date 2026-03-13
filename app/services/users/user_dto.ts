import { type Roles } from '#enums/roles'
import type User from '#models/user'

export interface CreateUserDTO {
  email: string
  password: string
  role: Roles
  creatorRole: Roles
}

export interface CreateUserResponseDTO {
  message: string
  user: User
}

export interface UpdateUserDTO {
  id: string
  email?: string
  password?: string
  role?: Roles
  updaterRole: Roles
}

export interface UpdateUserResponseDTO {
  message: string
  user: User
}

export interface DeleteUserDTO {
  id: string
  deleterRole: Roles
}

export interface DeleteUserResponseDTO {
  message: string
}

export interface GetUserByIdDTO {
  id: string
}
