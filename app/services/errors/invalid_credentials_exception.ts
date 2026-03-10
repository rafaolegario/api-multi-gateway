import { Exception } from '@adonisjs/core/exceptions'

export class InvalidCredentialsException extends Exception {
  static status = 401
  static code = 'E_INVALID_CREDENTIALS'

  constructor(message = 'Invalid email or password') {
    super(message, { status: 401, code: 'E_INVALID_CREDENTIALS' })
  }
}
