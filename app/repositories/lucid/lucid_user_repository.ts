import { type Roles } from '#enums/roles'
import User from '#models/user'
import { type PaginatedResult, type PaginationParams } from '../../types/pagination_types.ts'
import { UserRepository } from '../contracts/user_repository.ts'

export class LucidUserRepository extends UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.query().where('email', email).first()
  }

  async findById(id: string): Promise<User | null> {
    return User.find(id)
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<User>> {
    const { page, limit } = pagination
    const result = await User.query().paginate(page, limit)
    const data = result.all()

    return {
      data,
      total: result.total,
      page: result.currentPage,
      limit: result.perPage,
      lastPage: result.lastPage,
    }
  }

  async update(user: User): Promise<User> {
    await user.save()
    return user
  }

  async delete(id: string): Promise<void> {
    const user = await User.find(id)
    if (user) {
      await user.delete()
    }
  }

  async create(data: { email: string; password: string; role: Roles }): Promise<User> {
    return User.create(data)
  }
}
