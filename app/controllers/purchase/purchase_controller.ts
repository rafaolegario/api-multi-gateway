import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { PurchaseService } from '#services/purchase/purchase_service'
import { purchaseValidator } from '#validators/purchase_validator'

@inject()
export default class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  async purchase({ request, response }: HttpContext) {
    const { cardNumber, cvv, email, name, products } =
      await request.validateUsing(purchaseValidator)

    const result = await this.purchaseService.purchase({
      email,
      name,
      cardNumber,
      cvv,
      products,
    })

    if (result.success === false) {
      return response.badRequest({
        message: result.message,
      })
    }

    return response.ok({ message: result.message })
  }
}
