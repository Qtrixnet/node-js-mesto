import { ErrorCode } from '../constants/errors'

export class ForbiddenError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = ErrorCode.FORBIDDEN
  }
}
