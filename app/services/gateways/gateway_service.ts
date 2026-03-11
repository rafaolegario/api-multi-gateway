import type Gateway from '#models/gateway'
import { type GatewayRepository } from '#repositories/contracts/gateway_repository'
import { NotAllowedException } from '#services/errors/not_allowed_exception'
import { ResourceNotFoundException } from '#services/errors/resource_not_found_exception'
import { type PaginatedResult, type PaginationParams } from '../../types/index.ts'
import { type GatewayChangePriorityDTO, type GatewayToggleIsActiveDTO } from './gateway_dto.ts'

export class GatewayService {
  constructor(private gatewayRepository: GatewayRepository) { }

  async listGateways(pagination: PaginationParams): Promise<PaginatedResult<Gateway>> {
    return await this.gatewayRepository.findAll(pagination)
  }

  async toggleGatewayIsActive(data: GatewayToggleIsActiveDTO): Promise<Gateway> {
    const { gatewayId, isActive } = data

    const gateway = await this.gatewayRepository.findById(gatewayId)

    if (!gateway) {
      throw new ResourceNotFoundException(`Gateway with ID ${gatewayId} not found`)
    }

    if (gateway.isActive !== isActive) {
      gateway.isActive = isActive
      return await this.gatewayRepository.update(gateway)
    }

    return gateway
  }

  async changeGatewayPriority(data: GatewayChangePriorityDTO): Promise<Gateway> {
    const { gatewayId, priority } = data

    const gateway = await this.gatewayRepository.findById(gatewayId)

    if (!gateway) {
      throw new ResourceNotFoundException(`Gateway with ID ${gatewayId} not found`)
    }

    if (priority <= 0) {
      throw new NotAllowedException('Priority cannot be zero or negative', { status: 422 })
    }

    if (gateway.priority !== priority) {
      gateway.priority = priority
      return await this.gatewayRepository.update(gateway)
    }

    return gateway
  }
}
