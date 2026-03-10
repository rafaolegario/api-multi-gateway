import router from '@adonisjs/core/services/router'
import './routes/public/authenticate_routes.ts'

router.get('/', () => {
  return { hello: 'world' }
})
