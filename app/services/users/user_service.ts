import { Roles } from '#enums/roles'
import { type UserRepository } from '#repositories/contracts/user_repository'
import { NotAllowedException } from '#services/errors/not_allowed_exception'
import hash from '@adonisjs/core/services/hash'
import {
  type CreateUserResponseDTO,
  type CreateUserDTO,
  type UpdateUserDTO,
  type UpdateUserResponseDTO,
  type DeleteUserDTO,
  type DeleteUserResponseDTO,
  type GetUserByIdDTO,
} from './user_dto.ts'
import { type PaginationParams } from '../../types/pagination_types.ts'
import type User from '#models/user'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async listUsers(pagination: PaginationParams) {
    return await this.userRepository.findAll(pagination)
  }

  async getUserById(data: GetUserByIdDTO): Promise<User> {
    const { id } = data
    return await this.verifyIfUserExistsById(id)
  }

  async deleteUser(data: DeleteUserDTO): Promise<DeleteUserResponseDTO> {
    const { id, deleterRole } = data

    const user = await this.verifyIfUserExistsById(id)

    this.verifyCreatorRole(deleterRole, user.role)

    await this.userRepository.delete(id)

    return { message: 'User Deleted' }
  }

  async updateUser(data: UpdateUserDTO): Promise<UpdateUserResponseDTO> {
    const { id, email, password, role, updaterRole } = data

    if (role) {
      this.verifyCreatorRole(updaterRole, role)
    }

    const user = await this.verifyIfUserExistsById(id)

    if (email && email !== user.email) {
      await this.verifyIfEmailAlreadyExists(email)
    }

    user.email = email ?? user.email
    user.password = password ? await hash.make(password) : user.password
    user.role = role ?? user.role

    const updatedUser = await this.userRepository.update(user)

    return { message: 'User Updated', user: updatedUser }
  }

  async createUser(data: CreateUserDTO): Promise<CreateUserResponseDTO> {
    const { email, password, role, creatorRole } = data

    this.verifyCreatorRole(creatorRole, role)

    await this.verifyIfEmailAlreadyExists(email)

    const hashedPassword = await hash.make(password)

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    })

    return { message: 'User Created', user }
  }

  private verifyCreatorRole(creatorRole: Roles, userRole: Roles) {
    const roleHierarchy = {
      [Roles.ADMIN]: 3,
      [Roles.MANAGER]: 2,
      [Roles.FINANCE]: 1,
      [Roles.USER]: 1,
    }

    if (creatorRole === Roles.ADMIN) {
      return
    }

    if (roleHierarchy[creatorRole] <= roleHierarchy[userRole]) {
      throw new NotAllowedException(
        `User with role ${creatorRole} cannot create/update/delete user with role ${userRole}`,
        { status: 403 }
      )
    }
  }

  private async verifyIfUserExistsById(id: string) {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotAllowedException(`User with id ${id} does not exist`, { status: 404 })
    }

    return user
  }

  private async verifyIfEmailAlreadyExists(email: string) {
    const user = await this.userRepository.findByEmail(email)

    if (user) {
      throw new NotAllowedException(`User with email ${email} already exists`, { status: 400 })
    }
  }
}
