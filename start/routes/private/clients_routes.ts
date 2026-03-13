import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { Roles } from '#enums/roles'
const ClientController = () => import('#controllers/clients/client_controller')

router
  .group(() => {
    router.group(() => {
      router.get('/', [ClientController, 'listClients'])
      router.get('/:id/transactions', [ClientController, 'getClientAndTransactions'])
    })
  })
  .prefix('/clients')
  .use([
    middleware.auth(),
    middleware.role({ roles: [Roles.USER, Roles.MANAGER, Roles.ADMIN, Roles.FINANCE] }),
  ])
