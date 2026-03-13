import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { Roles } from '#enums/roles'
const ProductsController = () => import('#controllers/products/products_controller')

router
  .group(() => {
    router.group(() => {
      router.get('/', [ProductsController, 'listProducts'])
      router.get('/:id', [ProductsController, 'getProduct'])
      router.post('/', [ProductsController, 'createProduct'])
      router.put('/:id', [ProductsController, 'updateProduct'])
      router.delete('/:id', [ProductsController, 'deleteProduct'])
    })
  })
  .prefix('/products')
  .use([
    middleware.auth(),
    middleware.role({ roles: [Roles.ADMIN, Roles.MANAGER, Roles.FINANCE] }),
  ])
