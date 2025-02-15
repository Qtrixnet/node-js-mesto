import { ErrorCode } from '../constants/errors'

export class NotFoundError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = ErrorCode.NOT_FOUND
  }
}
