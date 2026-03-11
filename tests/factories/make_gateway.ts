import Gateway from '#models/gateway'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export function MakeGateway(override: Partial<Gateway> = {}): Gateway {
  const gateway = new Gateway()
  gateway.id = override.id ?? randomUUID()
  gateway.name = override.name ?? faker.company.name()
  gateway.isActive = override.isActive ?? true
  gateway.priority = override.priority ?? faker.number.int({ min: 1, max: 10 })
  gateway.createdAt = override.createdAt ?? DateTime.now()
  gateway.updatedAt = override.updatedAt ?? null
  gateway.$isPersisted = true

  return gateway
}
