import router from '@adonisjs/core/services/router'

const PurchaseController = () => import('#controllers/purchase/purchase_controller')

router.group(() => {
  router.post('/purchase', [PurchaseController, 'purchase'])
})
