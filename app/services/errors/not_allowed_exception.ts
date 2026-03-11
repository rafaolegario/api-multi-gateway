import { Exception } from '@adonisjs/core/exceptions'

export class NotAllowedException extends Exception {
  constructor(message: string, options?: { status?: number }) {
    super(message, {
      status: options?.status || 400,
      code: 'E_NOT_ALLOWED',
    })
  }
}
