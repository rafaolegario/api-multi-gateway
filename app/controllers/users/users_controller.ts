import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/users/user_service'
import {
  listUsersQuery,
  getUserParams,
  createUserBody,
  updateUserBody,
  deleteUserParams,
} from '#validators/user_validator'

@inject()
export default class UsersController {
  constructor(private userService: UserService) {}

  async listUsers({ request }: HttpContext) {
    const { page, limit } = await request.validateUsing(listUsersQuery)

    const result = await this.userService.listUsers({ page, limit })

    return {
      users: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        lastPage: result.lastPage,
      },
    }
  }

  async getUser({ request }: HttpContext) {
    const { id } = await request.validateUsing(getUserParams, {
      data: request.params(),
    })

    const user = await this.userService.getUserById({ id })

    return { user }
  }

  async createUser({ request, auth }: HttpContext) {
    const { email, password, role } = await request.validateUsing(createUserBody)

    const result = await this.userService.createUser({
      email,
      password,
      role,
      creatorRole: auth.user!.role,
    })

    return result
  }

  async updateUser({ request, auth }: HttpContext) {
    const { id } = await request.validateUsing(getUserParams, {
      data: request.params(),
    })
    const { email, password, role } = await request.validateUsing(updateUserBody)

    const result = await this.userService.updateUser({
      id,
      email,
      password,
      role,
      updaterRole: auth.user!.role,
    })

    return result
  }

  async deleteUser({ request, auth }: HttpContext) {
    const { id } = await request.validateUsing(deleteUserParams, {
      data: request.params(),
    })

    const result = await this.userService.deleteUser({
      id,
      deleterRole: auth.user!.role,
    })

    return result
  }
}
