import { Exception } from '@adonisjs/core/exceptions'

export class UnavailabilityServiceException extends Exception {
  constructor(message: string, options?: { status?: number }) {
    super(message, {
      status: options?.status || 503,
      code: 'E_UNAVAILABILITY',
    })
  }
}
