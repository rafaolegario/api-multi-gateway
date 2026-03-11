import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { type Exception } from '@adonisjs/core/exceptions'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const err = error as Exception & { messages?: any }

    if (err.messages) {
      return ctx.response.status(err.status ?? 422).json({
        message: 'Validation failed',
        errors: err.messages,
      })
    }

    return ctx.response.status(err.status ?? 500).json({
      message: err.message ?? 'Internal server error',
      code: err.code ?? 'E_UNKNOWN_ERROR',
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
