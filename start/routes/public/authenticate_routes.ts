import router from '@adonisjs/core/services/router'

const AuthenticateController = () => import('#controllers/auth/authenticate_controller')

router
  .group(() => {
    router.post('/login', [AuthenticateController, 'login'])
  })
  .prefix('/auth')
