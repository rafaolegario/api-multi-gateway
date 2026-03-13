import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { Roles } from '#enums/roles'
const UsersController = () => import('#controllers/users/users_controller')

router
  .group(() => {
    router.group(() => {
      router.get('/', [UsersController, 'listUsers'])
      router.get('/:id', [UsersController, 'getUser'])
      router.post('/', [UsersController, 'createUser'])
      router.put('/:id', [UsersController, 'updateUser'])
      router.delete('/:id', [UsersController, 'deleteUser'])
    })
  })
  .prefix('/users')
  .use([middleware.auth(), middleware.role({ roles: [Roles.ADMIN, Roles.MANAGER] })])
