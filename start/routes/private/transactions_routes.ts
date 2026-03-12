import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { Roles } from '#enums/roles'
const TransactionsController = () => import('#controllers/transactions/transactions_controller')

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [TransactionsController, 'listTransactions'])
        router.get('/:id', [TransactionsController, 'getTransaction'])
      })
      .use(middleware.role({ roles: [Roles.USER, Roles.MANAGER, Roles.ADMIN, Roles.FINANCE] }))

    router
      .group(() => {
        router.post('/:id/refund', [TransactionsController, 'refundTransaction'])
      })
      .use(middleware.role({ roles: [Roles.ADMIN, Roles.FINANCE] }))
  })
  .prefix('/transactions')
  .use(middleware.auth())
