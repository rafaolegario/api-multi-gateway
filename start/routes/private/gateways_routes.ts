import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { Roles } from '#enums/roles'
const GatewaysController = () => import('#controllers/gateways/gateways_controller')

router
  .group(() => {
    router.get('/', [GatewaysController, 'listGateways'])
    router.patch('/:id/toggle', [GatewaysController, 'toggleIsActive'])
    router.patch('/:id/change-priority', [GatewaysController, 'changePriority'])
  })
  .prefix('/gateways')
  .use([middleware.auth(), middleware.role({ roles: [Roles.ADMIN] })])
