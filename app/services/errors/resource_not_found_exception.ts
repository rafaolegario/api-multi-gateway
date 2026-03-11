import { Exception } from '@adonisjs/core/exceptions'

export class ResourceNotFoundException extends Exception {
  static status = 404
  static code = 'E_RESOURCE_NOT_FOUND'

  constructor(message: string) {
    super(message, { status: 404, code: 'E_RESOURCE_NOT_FOUND' })
  }
}
