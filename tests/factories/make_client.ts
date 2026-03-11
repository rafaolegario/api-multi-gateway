import Client from '#models/client'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export function MakeClient(override: Partial<Client> = {}): Client {
  const client = new Client()
  client.id = override.id ?? randomUUID()
  client.name = override.name ?? faker.person.fullName()
  client.email = override.email ?? faker.internet.email()
  client.createdAt = override.createdAt ?? DateTime.now()
  client.updatedAt = override.updatedAt ?? null
  client.$isPersisted = true

  return client
}
