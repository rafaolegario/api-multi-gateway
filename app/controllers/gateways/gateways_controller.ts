import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GatewayService } from '#services/gateways/gateway_service'
import {
  changePriorityBody,
  changePriorityParams,
  listGatewaysQuery,
  toggleIsActiveParams,
} from '#validators/gateways_validator'
import GatewaysTransformer from '#transformers/gateways_transform'

@inject()
export default class GatewaysController {
  constructor(private gatewayService: GatewayService) {}

  async listGateways({ request }: HttpContext) {
    const { page, limit } = await request.validateUsing(listGatewaysQuery)

    const paginatedResult = await this.gatewayService.listGateways({
      page,
      limit,
    })

    return {
      gateways: GatewaysTransformer.collection(paginatedResult.data),
    }
  }

  async toggleIsActive({ request }: HttpContext) {
    const { id: gatewayId } = await request.validateUsing(toggleIsActiveParams, {
      data: request.params(),
    })

    const gateway = await this.gatewayService.toggleIsActive({ gatewayId })

    return {
      message: 'Gateway isActive toggled successfully',
      gateway: new GatewaysTransformer(gateway).toObject(),
    }
  }

  async changePriority({ request }: HttpContext) {
    const { id: gatewayId } = await request.validateUsing(changePriorityParams, {
      data: request.params(),
    })
    const { priority } = await request.validateUsing(changePriorityBody)

    const gateway = await this.gatewayService.changePriority({ gatewayId, priority })

    return {
      message: 'Gateway priority changed successfully',
      gateway: new GatewaysTransformer(gateway).toObject(),
    }
  }
}
