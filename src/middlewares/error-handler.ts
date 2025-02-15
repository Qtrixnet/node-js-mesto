import { NextFunction, Request, Response } from 'express'
import { ErrorCode } from '../constants/errors'

interface CustomError extends Error {
  statusCode?: number
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _next: NextFunction
) => {
  const { statusCode = ErrorCode.INTERNAL_SERVER_ERROR, message } = err

  res.status(statusCode).send({
    message:
      statusCode === ErrorCode.INTERNAL_SERVER_ERROR
        ? 'Произошла ошибка'
        : message
  })
}
